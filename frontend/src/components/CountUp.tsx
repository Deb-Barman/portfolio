"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface Props {
  value: number;
  suffix?: string;
  className?: string;
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts up once when it scrolls into view. The final number is server-rendered. */
export default function CountUp({ value, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const state = { v: 0 };
        el.textContent = `0${suffix}`;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(state, {
              v: value,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = `${fmt(state.v)}${suffix}`;
              },
            }),
        });
        return () => {
          st.kill();
          el.textContent = `${fmt(value)}${suffix}`;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
      {suffix}
    </span>
  );
}
