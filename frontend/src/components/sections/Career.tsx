"use client";

import { useRef } from "react";
import { career } from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import styles from "./Career.module.css";

const PALETTE = [CURSOR_COLORS.green, CURSOR_COLORS.pink, CURSOR_COLORS.amber, CURSOR_COLORS.lilac];

/** A glowing dot rides down the timeline as you scroll; each milestone is dragged in from the side. */
export default function Career() {
  const lineWrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = lineWrap.current;
      if (!wrap || !fill.current || !dot.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrollTrigger = { trigger: wrap, start: "top 60%", end: "bottom 60%", scrub: true };
        gsap.to(fill.current, { scaleY: 1, ease: "none", scrollTrigger });
        gsap.fromTo(dot.current, { top: "0%" }, { top: "100%", ease: "none", scrollTrigger });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(fill.current, { scaleY: 1 });
        gsap.set(dot.current, { top: "100%" });
      });
      return () => mm.revert();
    },
    { scope: lineWrap },
  );

  return (
    <section id="career" className={styles.section} aria-labelledby="career-title">
      <div className={styles.inner}>
        <div className={styles.sticky}>
          <Assemble from="left" cursors={[{ label: "type", color: CURSOR_COLORS.lilac, end: "br" }]}>
            <h2 id="career-title" className={styles.title}>
              My career <span className={styles.amp}>&amp;</span> experience
            </h2>
          </Assemble>
        </div>

        <div ref={lineWrap} className={styles.timeline}>
          <div className={styles.line} aria-hidden="true">
            <div ref={fill} className={styles.fill} />
            <div ref={dot} className={styles.dot} />
          </div>
          <ol className={styles.list}>
            {career.map((step, i) => (
              <li key={step.role}>
                <Assemble
                  from="right"
                  radius={14}
                  start="top 94%"
                  end="top 52%"
                  cursors={[{ label: ["layout", "copy", "build", "ship", "motion"][i % 5], color: PALETTE[i % 4], end: "br" }]}
                >
                  <article className={styles.entry}>
                    <header className={styles.head}>
                      <div>
                        <h3 className={styles.role}>{step.role}</h3>
                        <p className={styles.context}>{step.context}</p>
                      </div>
                      <p className={styles.year}>{step.year}</p>
                    </header>
                    <p className={styles.text}>{step.text}</p>
                  </article>
                </Assemble>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
