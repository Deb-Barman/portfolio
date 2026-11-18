import { about } from "@/data/portfolio";
import Assemble from "../Assemble";
import { CURSOR_COLORS } from "../Blueprint";
import CountUp from "../CountUp";
import ScrubText from "../ScrubText";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.inner}>
        <div className={styles.sticky}>
          <Assemble from="left" cursors={[{ label: "type", color: CURSOR_COLORS.amber, end: "br" }]}>
            <h2 id="about-title" className={styles.title}>
              {about.title}
            </h2>
          </Assemble>
        </div>

        <div>
          <ScrubText text={about.text} className={styles.para} />
          <Assemble
            className={styles.proof}
            from="up"
            cursors={[
              { label: "stats", color: CURSOR_COLORS.green, end: "tr" },
              { label: "layout", color: CURSOR_COLORS.lilac, end: "bl" },
            ]}
            radius={14}
          >
            <ul className={styles.proofList}>
              {about.proof.map((p) => (
                <li key={p.label}>
                  <CountUp value={p.value} suffix={p.suffix} className={styles.num} />
                  <span className={styles.label}>{p.label}</span>
                </li>
              ))}
            </ul>
          </Assemble>
        </div>
      </div>
    </section>
  );
}
