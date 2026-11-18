"use client";

import { type CSSProperties, useRef } from "react";
import { whatIDo } from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import shared from "./Section.module.css";
import styles from "./WhatIDo.module.css";

const PALETTE = [CURSOR_COLORS.lilac, CURSOR_COLORS.green, CURSOR_COLORS.amber, CURSOR_COLORS.pink];

/** Sticky card stack: each card tucks back and dims as the next one slides over it. */
export default function WhatIDo() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", root);
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          if (!next) return;
          const trigger = { trigger: next, start: "top 88%", end: "top 26%", scrub: true };
          gsap.to(slot.querySelector("[data-card]"), { scale: 0.93, ease: "none", scrollTrigger: trigger });
          gsap.to(slot.querySelector("[data-shade]"), { opacity: 0.6, ease: "none", scrollTrigger: trigger });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="what" ref={rootRef} className={styles.section} aria-labelledby="what-title">
      <div className={styles.inner}>
        <div className={styles.sticky}>
          <Assemble from="left" cursors={[{ label: "type", color: CURSOR_COLORS.amber, end: "br" }]}>
            <h2 id="what-title" className={shared.title}>
              What I do
            </h2>
          </Assemble>
        </div>

        <ul className={styles.stack}>
          {whatIDo.map((item, i) => (
            <li key={item.title} className={styles.slot} style={{ "--i": i } as CSSProperties} data-slot="">
              <article className={styles.card} data-card="">
                <Assemble
                  drag={false}
                  radius={22}
                  start="top 95%"
                  end="top 55%"
                  cursors={[{ label: ["layout", "build", "motion", "color"][i % 4], color: PALETTE[i % 4], end: i % 2 ? "tr" : "br" }]}
                >
                  <div className={styles.cardIn}>
                    <div>
                      <h3 className={styles.name}>{item.title}</h3>
                    </div>
                    <div>
                      <p className={styles.desc}>{item.description}</p>
                      <ul className={styles.tags} aria-label={`${item.title} skills and tools`}>
                        {item.tags.map((t) => (
                          <li key={t} className={styles.tag}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Assemble>
                <div className={styles.shade} data-shade="" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
