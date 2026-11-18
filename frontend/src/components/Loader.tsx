"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import styles from "./Loader.module.css";

const MARQUEE = ["A Creative Developer", "A Creative Builder", "A Creative Developer", "A Creative Builder"];
const BARS = Array.from({ length: 27 });

/**
 * Preloader. First visit in a session: counter → "Welcome" pill → click (or scroll / key) to enter.
 * Repeat visits and reduced-motion: a quick curtain. The page underneath is fully server-rendered,
 * so crawlers and no-JS visitors always get the content.
 */
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);
  const labelsRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const enterRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const pill = pillRef.current;
    const bg = bgRef.current;
    const labels = labelsRef.current;
    if (!root || !pill || !bg || !labels) return;

    const html = document.documentElement;
    html.classList.add("is-loading");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visited = false;
    try {
      visited = sessionStorage.getItem("db-visited") === "1";
    } catch {
      /* storage blocked — treat as first visit */
    }

    let finished = false;
    let entering = false;
    const killers: Array<() => void> = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("db-visited", "1");
      } catch {
        /* ignore */
      }
      html.classList.remove("is-loading");
      markReady();
      setGone(true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // Fast paths ───────────────────────────────────────────────
    if (reduce) {
      const t = gsap.to(root, { opacity: 0, duration: 0.25, onComplete: finish });
      killers.push(() => t.kill());
    } else if (visited) {
      const t = gsap.to(root, { yPercent: -100, duration: 0.9, delay: 0.2, ease: "expo.inOut", onComplete: finish });
      killers.push(() => t.kill());
    } else {
      // Full path ───────────────────────────────────────────────
      const counter = { v: 0 };
      const paint = () => {
        if (pctRef.current) pctRef.current.textContent = `${Math.round(counter.v)}%`;
      };
      killers.push(() => gsap.killTweensOf(counter));
      gsap.to(counter, { v: 92, duration: 1.8, ease: "power2.out", onUpdate: paint });

      const enter = () => {
        if (entering || finished) return;
        entering = true;
        const scale =
          Math.max(window.innerWidth / pill.offsetWidth, window.innerHeight / pill.offsetHeight) * 2.6;
        gsap
          .timeline({ onComplete: finish })
          .to(labels, { opacity: 0, duration: 0.2 }, 0)
          .to(bg, { scale, duration: 1, ease: "power4.in" }, 0)
          .to(root, { opacity: 0, duration: 0.45, ease: "power1.out" }, 0.85);
      };
      enterRef.current = enter;

      const armed: Array<[string, EventListener]> = [];
      const arm = () => {
        (["wheel", "touchstart", "keydown"] as const).forEach((type) => {
          const fn: EventListener = () => enter();
          window.addEventListener(type, fn, { passive: true, once: true });
          armed.push([type, fn]);
        });
      };

      const loaded = new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      });
      const fonts: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
      const minWait = new Promise<void>((res) => window.setTimeout(res, 1600));

      Promise.all([loaded, fonts, minWait]).then(() => {
        if (finished) return;
        gsap.to(counter, {
          v: 100,
          duration: 0.5,
          ease: "power1.out",
          onUpdate: paint,
          onComplete: () => {
            setReady(true);
            arm();
          },
        });
      });

      // Failsafe: never trap a visitor behind the loader.
      const failsafe = window.setTimeout(enter, 12000);
      killers.push(() => {
        window.clearTimeout(failsafe);
        armed.forEach(([type, fn]) => window.removeEventListener(type, fn));
      });
    }

    return () => {
      killers.forEach((k) => k());
      html.classList.remove("is-loading");
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  if (gone) return null;

  return (
    <div ref={rootRef} className={`${styles.root} js-only`}>
      <div className={styles.header}>
        <span className={styles.logo}>DB.</span>
        <div className={styles.game} aria-hidden="true">
          <div className={styles.gameBox}>
            <div className={styles.gameIn}>
              {BARS.map((_, i) => (
                <div key={i} className={styles.line} />
              ))}
            </div>
            <div className={styles.ball} />
          </div>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <button
        ref={pillRef}
        type="button"
        className={styles.pill}
        data-ready={ready}
        disabled={!ready}
        onPointerMove={onMove}
        onClick={() => enterRef.current()}
        aria-label={ready ? "Enter the site" : "Loading"}
      >
        <span ref={bgRef} className={styles.pillBg}>
          <span className={styles.pillGlow} />
        </span>
        <span ref={labelsRef} className={styles.labels}>
          <span className={styles.loading}>
            Loading <span ref={pctRef} className={styles.pct}>0%</span>
          </span>
          <span className={styles.welcome}>Welcome</span>
        </span>
      </button>
    </div>
  );
}
