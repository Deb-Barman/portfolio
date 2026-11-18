"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Ambient.module.css";

/** Fixed background: pointer-lit blueprint grid + two glow orbs that drift as you scroll. */
export default function Ambient() {
  const layerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const oneRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(oneRef.current, {
          x: () => window.innerWidth * 0.12,
          y: () => window.innerHeight * 0.55,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });
        gsap.to(twoRef.current, {
          y: () => -window.innerHeight * 0.35,
          x: () => -window.innerWidth * 0.08,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });

        if (grid && window.matchMedia("(hover: hover)").matches) {
          const setX = gsap.quickSetter(grid, "--mx", "px") as (v: number) => void;
          const setY = gsap.quickSetter(grid, "--my", "px") as (v: number) => void;
          const move = (e: PointerEvent) => {
            setX(e.clientX);
            setY(e.clientY);
          };
          window.addEventListener("pointermove", move, { passive: true });
          return () => window.removeEventListener("pointermove", move);
        }
      });
      return () => mm.revert();
    },
    { scope: layerRef },
  );

  return (
    <>
      <div ref={layerRef} className={styles.layer} aria-hidden="true">
        <div ref={gridRef} className={styles.grid} />
        <div ref={oneRef} className={`${styles.glow} ${styles.glowOne}`}>
          <div className={styles.orb} />
        </div>
        <div ref={twoRef} className={`${styles.glow} ${styles.glowTwo}`}>
          <div className={`${styles.orb} ${styles.orbTwo}`} />
        </div>
      </div>
      <div className={styles.navFade} aria-hidden="true" />
    </>
  );
}
