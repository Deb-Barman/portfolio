"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Hairline reading-progress bar at the very top. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bar.current) return;
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      },
    );
  });

  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        height: 2,
        zIndex: 60,
        transformOrigin: "0 50%",
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, var(--accent), var(--pink))",
      }}
    />
  );
}
