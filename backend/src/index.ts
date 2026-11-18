import { config, createApp } from "./app.js";

const app = createApp();

const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(`API listening on :${config.port}`);
  console.log(`Allowed origins: ${config.allowedOrigins.join(", ")}`);
  if (!config.resendApiKey) console.warn("RESEND_API_KEY is not set — emails will not be delivered.");
});

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
