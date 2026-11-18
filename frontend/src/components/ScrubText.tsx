"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface Props {
  text: string;
  className?: string;
}

/** Paragraph whose words light up one by one as you scroll through it. All text stays in the DOM. */
export default function ScrubText({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-w]", el);
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span data-w="">{word}</span>{" "}
        </span>
      ))}
    </p>
  );
}
