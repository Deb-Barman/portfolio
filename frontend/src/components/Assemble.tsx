"use client";

import { type CSSProperties, type ElementType, type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BlueprintCursor, BlueprintFrame, type Corner } from "./Blueprint";
import styles from "./Assemble.module.css";

export interface CursorSpec {
  label: string;
  color: string;
  /** Which corner handle this cursor ends up dragging. */
  end: Corner;
}

interface AssembleProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  cursors?: CursorSpec[];
  /** Direction the block is "dragged in" from. */
  from?: "left" | "right" | "up" | "scatter";
  /** Move the block into place (turn off for sticky / pinned elements). */
  drag?: boolean;
  radius?: number | string;
  start?: string;
  end?: string;
  showDim?: boolean;
}

/**
 * The signature effect: as you scroll, the block first appears as a wireframe —
 * dashed outline, handles, a live width × height tag — while named cursors drag it
 * into position. Then the real content prints in and the wireframe fades away.
 * Fully scrubbed, so it plays in reverse when you scroll back up.
 * Content is always present in the DOM (SSR) for SEO and no-JS visitors.
 */
export default function Assemble({
  children,
  as,
  className,
  style,
  cursors = [],
  from = "scatter",
  drag = true,
  radius = 0,
  start = "top 92%",
  end = "top 40%",
  showDim = true,
}: AssembleProps) {
  const Tag: ElementType = as ?? "div";
  const rootRef = useRef<HTMLElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const mover = moverRef.current;
      const frame = frameRef.current;
      const content = contentRef.current;
      if (!root || !mover || !frame || !content) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const dims = { w: mover.offsetWidth, h: mover.offsetHeight };
        const measure = () => {
          dims.w = mover.offsetWidth;
          dims.h = mover.offsetHeight;
        };
        const ro = new ResizeObserver(measure);
        ro.observe(mover);

        const origin = {
          left: { x: -90, y: 28, r: -1.5 },
          right: { x: 90, y: 28, r: 1.5 },
          up: { x: 0, y: 90, r: 0 },
          scatter: {
            x: gsap.utils.random(-70, 70, 1),
            y: gsap.utils.random(50, 90, 1),
            r: gsap.utils.random(-2.5, 2.5, 0.1),
          },
        }[from];

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start,
            end,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        if (drag) {
          tl.fromTo(
            mover,
            { x: origin.x, y: origin.y, rotation: origin.r, scale: 0.97 },
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.6, ease: "power3.out" },
            0,
          );
        }

        tl.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0);

        if (showDim && chipRef.current) {
          const chip = chipRef.current;
          const proxy = { p: 0 };
          tl.fromTo(
            proxy,
            { p: 0 },
            {
              p: 1,
              duration: 0.55,
              ease: "power2.out",
              onUpdate: () => {
                chip.textContent = `${Math.round(dims.w * proxy.p)} × ${Math.round(dims.h * proxy.p)}`;
              },
            },
            0,
          );
        }

        tl.fromTo(
          content,
          { opacity: 0, clipPath: "inset(-80px -80px 100% -80px)" },
          {
            opacity: 1,
            clipPath: "inset(-80px -80px -80px -80px)",
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.5,
        );
        tl.to(frame, { opacity: 0, duration: 0.22 }, 0.8);

        const corner = (c: Corner) => ({
          x: c.includes("r") ? dims.w : 0,
          y: c.includes("b") ? dims.h : 0,
        });

        cursors.forEach((spec, i) => {
          const el = cursorRefs.current[i];
          if (!el) return;
          const kx = spec.end.includes("r") ? 1 : -1;
          const ky = spec.end.includes("b") ? 1 : -1;
          tl.fromTo(
            el,
            {
              x: () => corner(spec.end).x + kx * 170,
              y: () => corner(spec.end).y + ky * 120,
              opacity: 0,
            },
            {
              x: () => corner(spec.end).x,
              y: () => corner(spec.end).y,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
            },
            0.03 * i,
          ).to(el, { opacity: 0, scale: 0.6, duration: 0.2 }, 0.8);
        });

        return () => ro.disconnect();
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <Tag
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      style={{ ...style, "--radius": typeof radius === "number" ? `${radius}px` : radius } as CSSProperties}
    >
      <div ref={moverRef} className={styles.mover}>
        <BlueprintFrame frameRef={frameRef} chipRef={chipRef} showDim={showDim} />
        <div ref={contentRef} className={styles.content}>
          {children}
        </div>
        {cursors.map((c, i) => (
          <BlueprintCursor
            key={`${c.label}-${i}`}
            cursorRef={(el) => {
              cursorRefs.current[i] = el;
            }}
            label={c.label}
            color={c.color}
            flip={c.end.includes("r")}
          />
        ))}
      </div>
    </Tag>
  );
}
