"use client";

import { useEffect, useState } from "react";
import { nav, person, socials } from "@/data/portfolio";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis-store";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [active, setActive] = useState<string>("");
  const linkedin = socials.find((s) => s.label === "LinkedIn");

  useEffect(() => {
    const triggers = nav.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(id);
          else setActive((cur) => (cur === id ? "" : cur));
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const go = (e: React.MouseEvent, target: string | number) => {
    e.preventDefault();
    scrollToTarget(target);
  };

  return (
    <header className={styles.header}>
      <a href="#top" className={styles.logo} onClick={(e) => go(e, 0)} aria-label={`${person.name} — back to top`}>
        DB.
      </a>
      {linkedin && (
        <a href={linkedin.href} target="_blank" rel="noopener noreferrer me" className={styles.handle}>
          {linkedin.handle}
        </a>
      )}
      <nav aria-label="Primary">
        <ul className={styles.list}>
          {nav.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`${styles.link} ${active === id ? styles.active : ""}`}
                onClick={(e) => go(e, `#${id}`)}
                aria-current={active === id ? "true" : undefined}
              >
                <span className={styles.roll}>
                  <span>{label}</span>
                  <span aria-hidden="true">{label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
