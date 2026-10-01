"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion, canHover } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  "Arabic Grills",
  "Nasi Lemak",
  "Mandi",
  "Stone-baked Pizza",
  "Shawarma",
  "Curry Laksa",
  "Kunafa",
  "Charcoal Kebab",
];

/**
 * A band of dish names sliding continuously across the page, which picks up
 * speed while the page is scrolled and runs whichever way the reader is
 * going.
 *
 * The track holds the word list twice. One copy is animated exactly one
 * half-width to the left and then snapped back, so the second copy lands
 * pixel-for-pixel where the first started and the loop has no visible seam.
 * `xPercent` rather than `x` keeps that true at any viewport width without
 * measuring anything.
 */
export default function CuisineRibbon() {
  const root = useRef(null);

  useGSAP(
    () => {
      // A permanently moving band is exactly what a reduced-motion preference
      // is asking us not to render, so it simply holds still.
      if (prefersReducedMotion()) return;

      const tween = gsap.to(".js-track", {
        xPercent: -50,
        duration: 38,
        ease: "none",
        repeat: -1,
      });

      // On touch the band simply cruises: the scroll-speed effect below makes
      // new tweens on every scroll event, which a phone pays for in frames.
      if (!canHover()) return;

      // Scroll speed feeds the band: a flick of the wheel sends it racing, and
      // it eases back to its cruising pace once the page settles. Scrolling
      // back up runs it backwards (a negative timeScale plays in reverse).
      let direction = 1;
      let hovering = false;
      const cruise = () => (hovering ? 0.25 : 1) * direction;
      const skew = gsap.quickTo(".js-track", "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      // One reusable timer to straighten the words once scrolling stops,
      // restarted on every scroll frame rather than stacking new ones.
      const settle = gsap.delayedCall(0.15, () => skew(0)).pause();

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (velocity !== 0) direction = velocity < 0 ? -1 : 1;
          const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 350);
          gsap.to(tween, {
            timeScale: boost * cruise(),
            duration: 0.25,
            overwrite: true,
            onComplete: () =>
              gsap.to(tween, { timeScale: cruise(), duration: 1.2 }),
          });
          skew(gsap.utils.clamp(-8, 8, velocity / -300));
          settle.restart(true);
        },
      });

      // Slow to a crawl on hover so a name can actually be read.
      const band = root.current;
      const slow = () => {
        hovering = true;
        gsap.to(tween, { timeScale: cruise(), duration: 0.6, overwrite: true });
      };
      const resume = () => {
        hovering = false;
        gsap.to(tween, { timeScale: cruise(), duration: 0.6, overwrite: true });
      };
      band.addEventListener("pointerenter", slow);
      band.addEventListener("pointerleave", resume);

      return () => {
        trigger.kill();
        band.removeEventListener("pointerenter", slow);
        band.removeEventListener("pointerleave", resume);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="What we cook"
      className="home-dark relative overflow-hidden border-y border-accent/30 bg-background py-7 text-foreground sm:py-9"
    >
      {/* Fades the band into the page background at both ends rather than
          letting words be guillotined by the viewport edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-40"
      />

      <div className="js-track flex w-max items-center">
        {/* Only the second copy is hidden from assistive tech. It exists purely
            to cover the gap the first one leaves as it slides out, so hiding
            both would drop the dish names entirely, and hiding neither would
            read the same eight names twice over. */}
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex items-center"
          >
            {WORDS.map((word, i) => (
              <span key={word} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 font-display text-3xl tracking-tight sm:px-9 sm:text-5xl ${
                    i % 2 ? "text-outline italic" : "text-brand-sand"
                  }`}
                >
                  {word}
                </span>
                {/* A diamond pip, matching the ornaments on the printed menu. */}
                <span aria-hidden="true" className="text-base text-accent sm:text-lg">
                  &#10022;
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
