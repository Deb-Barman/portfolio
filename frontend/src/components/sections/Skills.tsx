"use client";

import { useRef, useState } from "react";
import { skillGroups, skillLegend } from "@/data/portfolio";
import { gsap, useGSAP } from "@/lib/gsap";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import shared from "./Section.module.css";
import styles from "./Skills.module.css";

const PALETTE = [CURSOR_COLORS.lilac, CURSOR_COLORS.green, CURSOR_COLORS.pink, CURSOR_COLORS.amber];
const LABELS = ["layout", "build", "color", "type", "motion", "copy", "ship"];

const LEVEL_COLOR = {
  legend: "#ffb800",
  expert: "#00ff88",
  advanced: "#c2a4ff",
  beginner: "#445566",
} as const;

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-row]", root).forEach((row) => {
          const items = gsap.utils.toArray<HTMLElement>("[data-chip]", row);
          gsap.from(items, {
            opacity: 0,
            y: 18,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.035,
            scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none reverse" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="skills" ref={rootRef} className={styles.section} aria-labelledby="skills-title">
      <div className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.headTitle}>
            <Assemble from="left" cursors={[{ label: "type", color: CURSOR_COLORS.green, end: "br" }]}>
              <h2 id="skills-title" className={shared.title}>
                My skills
              </h2>
            </Assemble>
          </div>
          <p className={`${shared.sub} ${styles.sub}`}>
            <b>{total}</b> skills tracked across <b>{skillGroups.length}</b> domains — from Python internals to
            prompt design to color grading.
          </p>
          <ul className={styles.legend} aria-label="Skill levels">
            {skillLegend.map((l) => (
              <li key={l.level}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: LEVEL_COLOR[l.level],
                    boxShadow: l.level === "beginner" ? "none" : `0 0 6px ${LEVEL_COLOR[l.level]}`,
                  }}
                />
                {l.label}
              </li>
            ))}
          </ul>
        </header>

        <div className={styles.groups}>
          {skillGroups.map((group, gi) => (
            <Assemble
              key={group.label}
              className={styles.item}
              from={gi % 2 ? "right" : "left"}
              radius={16}
              start="top 96%"
              end="top 58%"
              cursors={[{ label: LABELS[gi % LABELS.length], color: PALETTE[gi % 4], end: gi % 2 ? "bl" : "br" }]}
            >
              <div className={styles.group}>
                <h3 className={styles.label}>{group.label}</h3>
                <ul className={styles.row} data-row="">
                  {group.skills.map((skill) => {
                    const key = `${group.label}:${skill.name}`;
                    const on = active === key;
                    return (
                      <li key={key} data-chip="">
                        <button
                          type="button"
                          className={`${styles.chip} ${styles[`lvl-${skill.level}`]} ${on ? styles.on : ""}`}
                          aria-pressed={on}
                          title={`${skill.name} — ${skill.level}`}
                          onClick={() => setActive(on ? null : key)}
                        >
                          <span className={styles.dot} aria-hidden="true" />
                          {skill.name}
                          <span className="sr-only"> ({skill.level})</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Assemble>
          ))}
        </div>
      </div>
    </section>
  );
}
