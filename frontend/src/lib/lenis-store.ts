import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null): void => {
  instance = l;
};
export const getLenis = (): Lenis | null => instance;

/** Smooth-scroll to a target (selector, element or Y), falling back to native. */
export function scrollToTarget(target: string | HTMLElement | number, offset = 0): void {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.6 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}
