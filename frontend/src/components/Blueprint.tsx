import type { Ref } from "react";
import styles from "./Assemble.module.css";

export type Corner = "tl" | "tr" | "bl" | "br";

export const CURSOR_COLORS = {
  lilac: "#c2a4ff",
  pink: "#fb8dff",
  green: "#00ff88",
  amber: "#ffb800",
} as const;

interface FrameProps {
  frameRef?: Ref<HTMLDivElement>;
  chipRef?: Ref<HTMLSpanElement>;
  showDim?: boolean;
}

/** Dashed wireframe outline with four corner handles and a live size tag. */
export function BlueprintFrame({ frameRef, chipRef, showDim = true }: FrameProps) {
  return (
    <div ref={frameRef} className={styles.frame} aria-hidden="true">
      <i className={`${styles.handle} ${styles.tl}`} />
      <i className={`${styles.handle} ${styles.tr}`} />
      <i className={`${styles.handle} ${styles.bl}`} />
      <i className={`${styles.handle} ${styles.br}`} />
      {showDim && <span ref={chipRef} className={styles.dim} />}
    </div>
  );
}

interface CursorProps {
  cursorRef?: Ref<HTMLSpanElement>;
  label: string;
  color: string;
  /** Put the label on the left of the arrow (for cursors near the right screen edge). */
  flip?: boolean;
}

/** A named collaborator cursor, like the ones dragging boxes around in a design tool. */
export function BlueprintCursor({ cursorRef, label, color, flip = false }: CursorProps) {
  return (
    <span
      ref={cursorRef}
      className={`${styles.cursor} ${flip ? styles.flip : ""}`}
      style={{ "--c": color } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1.2 1.2 6.4 14l1.9-5.3L13.6 6.8 1.2 1.2Z"
          fill="var(--c)"
          stroke="#0b080c"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <b className={styles.tag}>{label}</b>
    </span>
  );
}
