/**
 * Tiny "page is ready" signal. The loader calls markReady() when it has left;
 * hero entrance, smooth scrolling and API warm-up subscribe with onReady().
 */
let ready = false;
const subscribers = new Set<() => void>();

export function markReady(): void {
  if (ready) return;
  ready = true;
  subscribers.forEach((fn) => fn());
  subscribers.clear();
}

export function onReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export const isReady = (): boolean => ready;
