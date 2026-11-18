"use client";

import { useRef } from "react";
import { projects } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import { ArrowUpRight } from "../Icons";
import shared from "./Section.module.css";
import styles from "./Work.module.css";

/**
 * Desktop: the section pins and your vertical scroll drives the card row sideways,
 * with each card tilting in 3D as it passes the centre.
 * Mobile / reduced motion: a native snap-scrolling carousel.
 */
export default function Work() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const bar = barRef.current;
      if (!root || !track || !bar) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        root.classList.add(styles.pinned);

        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
        const setters = cards.map((c) => {
          gsap.set(c, { transformPerspective: 1200 });
          return {
            rot: gsap.quickSetter(c, "rotationY", "deg") as (v: number) => void,
            scale: gsap.quickSetter(c, "scale") as (v: number) => void,
          };
        });

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tilt = () => {
          const x = gsap.getProperty(track, "x") as number;
          const vw = window.innerWidth;
          cards.forEach((card, i) => {
            const centre = card.offsetLeft + card.offsetWidth / 2 + x;
            const d = gsap.utils.clamp(-1.2, 1.2, (centre - vw / 2) / vw);
            setters[i].rot(-d * 16);
            setters[i].scale(1 - Math.abs(d) * 0.08);
          });
        };

        const slide = gsap.to(track, { x: () => -distance(), ease: "none" });
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${distance() * 1.15}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: slide,
          onUpdate: (self) => {
            gsap.set(bar, { scaleX: self.progress });
            tilt();
          },
          onRefresh: tilt,
        });
        tilt();

        return () => {
          st.kill();
          slide.kill();
          gsap.set(cards, { clearProps: "transform" });
          gsap.set(track, { clearProps: "transform" });
          root.classList.remove(styles.pinned);
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="work" ref={rootRef} className={styles.section} aria-labelledby="work-title">
      <div className={styles.pin}>
        <header className={styles.head}>
          <div className={styles.headTitle}>
            <Assemble from="left" cursors={[{ label: "type", color: CURSOR_COLORS.pink, end: "br" }]}>
              <h2 id="work-title" className={shared.title}>
                Featured projects
              </h2>
            </Assemble>
          </div>
          <p className={shared.sub}>
            Six systems, built end-to-end and running — not screenshots of a tutorial.
          </p>
        </header>

        <div className={styles.viewport}>
          <ul ref={trackRef} className={styles.track}>
            {projects.map((p) => (
              <li key={p.name} className={styles.cardWrap}>
                <article className={styles.card} data-card="">
                  <div className={styles.top}>
                    <div className={styles.icon} aria-hidden="true">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className={styles.name}>
                        {p.name}
                        {p.featured && <span className={styles.badge}>Featured</span>}
                      </h3>
                      <p className={styles.kind}>{p.kind}</p>
                    </div>
                  </div>
                  <p className={styles.desc}>{p.description}</p>
                  <p className={styles.stat}>
                    <b>{p.stat.value}</b>
                    <span>{p.stat.label}</span>
                  </p>
                  <ul className={styles.tags} aria-label="Technologies">
                    {p.tags.map((t) => (
                      <li key={t} className={styles.tag}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={styles.link}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.name} on GitHub`}
                  >
                    View project <ArrowUpRight />
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.hint}>Swipe to see more →</p>
        <div className={styles.progress} aria-hidden="true">
          <i ref={barRef} />
        </div>
      </div>
    </section>
  );
}
