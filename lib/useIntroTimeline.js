import gsap from "gsap";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals every `.gsap-hidden` element immediately, skipping the intro.
 * Used for reduced-motion visitors.
 */
export function revealAll() {
  gsap.set(".gsap-hidden", { opacity: 1, clearProps: "transform" });
}

/**
 * requestAnimationFrame is throttled to roughly 1fps in a background tab, which
 * would leave the intro frozen mid-reveal on a page opened in a new tab. Hold
 * the timeline until the document is actually visible, then play it.
 *
 * Returns a cleanup function for useGSAP's context to call on unmount.
 */
export function playWhenVisible(tl) {
  if (!document.hidden) {
    tl.play();
    return undefined;
  }

  tl.pause(0);
  const onVisible = () => {
    if (!document.hidden) {
      tl.play();
      document.removeEventListener("visibilitychange", onVisible);
    }
  };
  document.addEventListener("visibilitychange", onVisible);

  return () => document.removeEventListener("visibilitychange", onVisible);
}
