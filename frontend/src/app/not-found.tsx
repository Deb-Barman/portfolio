import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <p style={{ color: "var(--accent)", fontSize: 18 }}>404</p>
        <h1 style={{ fontSize: "clamp(2.5rem, 10vw, 6rem)", fontWeight: 800, letterSpacing: "-0.04em" }}>
          Nothing built here yet.
        </h1>
        <p style={{ margin: "16px 0 28px", color: "var(--text-dim)" }}>
          That page doesn&apos;t exist. The portfolio is one scroll away.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "var(--bg)",
            fontWeight: 600,
          }}
        >
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
