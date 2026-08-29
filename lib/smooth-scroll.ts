/**
 * A tiny registry so overlays can pause momentum scrolling.
 *
 * When a dialog opens we set `overflow: hidden` on the body, which stops native
 * scrolling — but Lenis drives scroll itself and doesn't care about that, so
 * the page would keep gliding along behind the lightbox. Rather than pass the
 * instance down through props to every overlay, the provider registers it here
 * and overlays call pause/resume.
 */

type Controllable = { stop: () => void; start: () => void };

let instance: Controllable | null = null;

export function registerSmoothScroll(next: Controllable | null) {
  instance = next;
}

/** No-ops when momentum scrolling is off — reduced motion, or no JS yet. */
export function pauseSmoothScroll() {
  instance?.stop();
}

export function resumeSmoothScroll() {
  instance?.start();
}
