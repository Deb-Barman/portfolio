import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { config, isAllowedOrigin } from "./config.js";
import { MailNotConfiguredError, sendContactMail } from "./mail.js";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(2000),
  // honeypot: real visitors never fill this in
  website: z.string().max(200).nullish(),
});

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // Render sits behind a proxy — needed for per-IP rate limits
  app.use(helmet());

  app.use(
    cors({
      origin(origin, cb) {
        // No Origin header = curl, uptime pings, server-to-server. Browsers always send one.
        if (!origin || isAllowedOrigin(origin)) return cb(null, true);
        cb(null, false);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 86_400,
    }),
  );

  app.use(express.json({ limit: "10kb" }));
  app.use(rateLimit({ windowMs: 15 * 60_000, limit: 200, standardHeaders: "draft-8", legacyHeaders: false }));

  // Wake-up / uptime endpoint. Render's free plan sleeps after ~15 min idle.
  app.get("/health", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ ok: true, uptime: Math.round(process.uptime()) });
  });
  app.get("/", (_req, res) => {
    res.json({ service: "deb-portfolio-api", status: "ok" });
  });

  const contactLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many messages from this connection. Please try again in a few minutes." },
  });

  app.post("/api/contact", contactLimiter, async (req, res) => {
    const origin = req.get("origin");
    if (origin && !isAllowedOrigin(origin)) {
      res.status(403).json({ error: "This site isn't allowed to use the contact API." });
      return;
    }

    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Please check your name, email and message (the message needs at least 10 characters).",
      });
      return;
    }

    const { website, ...message } = parsed.data;
    if (website) {
      // Bot filled the honeypot — pretend it worked.
      res.json({ ok: true });
      return;
    }

    try {
      await sendContactMail(message);
      res.json({ ok: true });
    } catch (err) {
      if (err instanceof MailNotConfiguredError) {
        console.error(err.message);
        res.status(503).json({ error: "The contact service isn't configured yet." });
        return;
      }
      console.error("Failed to send contact email:", err);
      res.status(502).json({ error: "Couldn't deliver your message right now. Please try again shortly." });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = typeof err?.status === "number" ? err.status : 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? "Internal server error" : "Bad request" });
  };
  app.use(onError);

  return app;
}

export { config };
