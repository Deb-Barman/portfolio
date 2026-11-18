import { ImageResponse } from "next/og";

export const alt = "Deb Barman — AI Developer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b080c",
          backgroundImage:
            "radial-gradient(circle at 88% 8%, rgba(251,141,255,0.55) 0%, rgba(84,0,255,0.35) 32%, rgba(11,8,12,0) 60%)",
          color: "#eae5ec",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#c2a4ff", letterSpacing: 2 }}>DB.</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 40, color: "#c2a4ff", fontWeight: 300 }}>Hello! I&apos;m</div>
          <div style={{ display: "flex", fontSize: 168, fontWeight: 800, lineHeight: 0.92, letterSpacing: -6 }}>
            DEB BARMAN
          </div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 28, color: "#d8c4ff" }}>
            AI Developer · Builder · Python
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
