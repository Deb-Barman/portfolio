"use client";

import { useRef } from "react";
import { manifesto } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Manifesto.module.css";

/** Two opposing marquees that speed up and skew with your scroll velocity. */
export default function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root).map((row, i) => ({
          row,
          dir: i % 2 === 0 ? -1 : 1,
          x: 0,
          half: row.scrollWidth / 2,
        }));
        const measure = () => {
          rows.forEach((r) => {
            r.half = r.row.scrollWidth / 2;
            if (r.dir > 0 && r.x === 0) r.x = -r.half;
          });
        };
        measure();
        rows.forEach((r) => {
          if (r.dir > 0) r.x = -r.half;
        });

        let active = false;
        const watch = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            active = self.isActive;
          },
        });
        const meter = ScrollTrigger.create({ start: 0, end: "max" });
        const skewTo = gsap.quickTo(stage, "skewX", { duration: 0.5, ease: "power3" });

        const tick = (_time: number, delta: number) => {
          if (!active) return;
          const v = meter.getVelocity();
          const boost = Math.min(Math.abs(v) / 700, 6);
          const dt = delta / 1000;
          rows.forEach((r) => {
            r.x += r.dir * (60 + boost * 150) * dt;
            if (r.dir < 0 && r.x <= -r.half) r.x += r.half;
            if (r.dir > 0 && r.x >= 0) r.x -= r.half;
            gsap.set(r.row, { x: r.x });
          });
          skewTo(gsap.utils.clamp(-7, 7, -v / 450));
        };

        gsap.ticker.add(tick);
        window.addEventListener("resize", measure);
        return () => {
          gsap.ticker.remove(tick);
          window.removeEventListener("resize", measure);
          watch.kill();
          meter.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.section} aria-label="Manifesto">
      <div ref={stageRef} className={styles.stage}>
        {manifesto.map((row, ri) => (
          <div key={ri} className={styles.row} data-row="">
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.group} aria-hidden={copy === 1 ? "true" : undefined}>
                {row.map((m, i) => (
                  <span key={i} className={`${styles.item} ${m.accent ? styles.accent : ""}`}>
                    {m.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
