"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/useIntroTimeline";

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
 * A gold band of dish names sliding continuously across the page.
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
        duration: 34,
        ease: "none",
        repeat: -1,
      });

      // Slow to a crawl on hover so a name can actually be read.
      const band = root.current;
      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6 });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      band.addEventListener("pointerenter", slow);
      band.addEventListener("pointerleave", resume);

      return () => {
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
      className="relative overflow-hidden border-y border-border/70 bg-surface/40 py-6"
    >
      {/* Fades the band into the page background at both ends rather than
          letting words be guillotined by the viewport edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40"
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
            {WORDS.map((word) => (
              <span key={word} className="flex items-center">
                <span className="whitespace-nowrap px-7 font-display text-xl tracking-wide text-brand-sand/90 sm:text-2xl">
                  {word}
                </span>
                {/* A diamond pip, matching the ornaments on the printed menu. */}
                <span aria-hidden="true" className="text-sm text-accent">
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
