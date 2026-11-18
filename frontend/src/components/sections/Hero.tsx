"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady } from "@/lib/ready";
import { BlueprintCursor, BlueprintFrame, CURSOR_COLORS } from "../Blueprint";
import styles from "./Hero.module.css";

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span key={i} className={styles.char} aria-hidden="true">
          {c}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const c1Ref = useRef<HTMLSpanElement>(null);
  const c2Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const inner = innerRef.current;
      const box = boxRef.current;
      const frame = frameRef.current;
      const chip = chipRef.current;
      const c1 = c1Ref.current;
      const c2 = c2Ref.current;
      if (!root || !inner || !box || !frame || !chip || !c1 || !c2) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(`.${styles.char}`, root);
        const words = gsap.utils.toArray<HTMLElement>(`.${styles.word}`, root);
        const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", root);

        const dims = () => ({ w: box.offsetWidth, h: box.offsetHeight });
        const proxy = { p: 0 };

        gsap.set(chars, { yPercent: 118 });
        gsap.set(fades, { opacity: 0, y: 28 });
        gsap.set([frame, c1, c2], { opacity: 0 });

        // Entrance: letters rise, then the box "gets built" around them.
        const intro = gsap.timeline({ paused: true });
        intro
          .to(chars, { yPercent: 0, duration: 1.25, ease: "power4.out", stagger: 0.055 }, 0)
          .to(fades, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12 }, 0.5)
          .to(frame, { opacity: 0.55, duration: 0.5 }, 1.0)
          .fromTo(
            proxy,
            { p: 0 },
            {
              p: 1,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                const d = dims();
                chip.textContent = `${Math.round(d.w * proxy.p)} × ${Math.round(d.h * proxy.p)}`;
              },
            },
            1.0,
          )
          .fromTo(
            c1,
            { x: -150, y: -110, opacity: 0 },
            { x: 0, y: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
            1.0,
          )
          .fromTo(
            c2,
            { x: () => dims().w + 170, y: () => dims().h + 120, opacity: 0 },
            { x: () => dims().w, y: () => dims().h, opacity: 1, duration: 1.1, ease: "power3.out" },
            1.1,
          );

        // Idle: the two cursors keep nudging the box corners.
        const idle = gsap.timeline({ repeat: -1, yoyo: true, paused: true, defaults: { ease: "sine.inOut" } });
        idle
          .to(c1, { x: 10, y: 8, duration: 2.4 }, 0)
          .to(c2, { x: () => dims().w - 12, y: () => dims().h - 9, duration: 2.8 }, 0);
        intro.add(() => idle.play(), ">");

        const off = onReady(() => intro.play());

        // Scroll-out: words peel away at different speeds, the block shrinks and fades.
        gsap.to(words, {
          y: (i) => -(110 + i * 110),
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(inner, {
          opacity: 0,
          scale: 0.93,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "75% top", scrub: true },
        });

        return () => {
          off();
          intro.kill();
          idle.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section id="top" ref={rootRef} className={styles.hero} aria-label="Introduction">
      <div ref={innerRef} className={styles.inner}>
        <p className={styles.hello} data-fade="">
          Hello! I&apos;m
        </p>

        <div ref={boxRef} className={styles.nameBox}>
          <BlueprintFrame frameRef={frameRef} chipRef={chipRef} />
          <h1 className={styles.name} aria-label="Deb Barman">
            <span className={styles.word}>
              <Chars text="DEB" />
            </span>{" "}
            <span className={`${styles.word} ${styles.grad}`}>
              <Chars text="BARMAN" />
            </span>
          </h1>
          <div className={styles.role} data-fade="">
            <p className={styles.roleLead}>A Creative</p>
            <span className={styles.swap}>
              <span className={styles.swapCol}>
                <span>Builder</span>
                <span>Developer</span>
                <span aria-hidden="true">Builder</span>
              </span>
            </span>
          </div>
          <BlueprintCursor cursorRef={c1Ref} label="layout" color={CURSOR_COLORS.lilac} />
          <BlueprintCursor cursorRef={c2Ref} label="type" color={CURSOR_COLORS.amber} flip />
        </div>

        <div className={`${styles.cue} js-only`} data-fade="" aria-hidden="true">
          <span className={styles.cueLine} />
          Scroll to build
        </div>
      </div>
    </section>
  );
}
