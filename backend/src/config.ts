const list = (value: string | undefined, fallback: string): string[] =>
  (value ?? fallback)
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT ?? 10000),
  isProd: process.env.NODE_ENV === "production",
  allowedOrigins: list(process.env.ALLOWED_ORIGINS, "http://localhost:3000"),
  allowVercelPreviews: process.env.ALLOW_VERCEL_PREVIEWS === "true",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  contactTo: process.env.CONTACT_TO_EMAIL ?? "",
  contactFrom: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
};

const VERCEL_ORIGIN = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

export function isAllowedOrigin(origin: string): boolean {
  const clean = origin.replace(/\/+$/, "");
  if (config.allowedOrigins.includes(clean)) return true;
  return config.allowVercelPreviews && VERCEL_ORIGIN.test(clean);
}
