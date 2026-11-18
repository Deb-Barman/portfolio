"use client";

import { person } from "@/data/portfolio";
import { scrollToTarget } from "@/lib/lenis-store";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.made}>
        Designed and built
        <br />
        by <span>{person.name}</span>
      </p>
      <div className={styles.meta}>
        <a
          href="#top"
          className={styles.top}
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          Back to top
        </a>
        <p>© 2026 {person.name}</p>
      </div>
    </footer>
  );
}
