"use client";

import { useRef } from "react";
import { socials } from "@/data/portfolio";
import { RESUME_URL } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { FileIcon, socialIcons } from "./Icons";
import styles from "./SocialDock.module.css";

/** Social links + resume. Fades in once the hero is behind you, out again at the very end. */
export default function SocialDock() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const about = document.getElementById("about");
      if (!el || !about) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: { trigger: about, start: "top 85%", end: "top 55%", scrub: true },
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`${styles.dock} js-only`}>
      <div className={styles.icons}>
        {socials.map((s) => {
          const Icon = socialIcons[s.label as keyof typeof socialIcons];
          return (
            <a
              key={s.label}
              href={s.href}
              className={styles.icon}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={`${s.label} — ${s.handle}`}
            >
              <Icon />
            </a>
          );
        })}
      </div>
      {RESUME_URL && (
        <a className={styles.resume} href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Resume <FileIcon />
        </a>
      )}
    </div>
  );
}
