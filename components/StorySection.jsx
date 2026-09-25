"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storyPillars } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 30 });
      gsap.set(".js-spine", { scaleY: 0, transformOrigin: "50% 0%" });

      gsap.utils.toArray(".js-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // The spine draws itself downward as the list scrolls past, so the three
      // kitchens read as one continuous thread rather than three cards.
      // `scrub` ties it to scroll position instead of playing on entry.
      gsap.to(".js-spine", {
        opacity: 1,
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".js-pillars",
          start: "top 78%",
          end: "bottom 65%",
          scrub: 0.6,
        },
      });

      // The logo mark drifts slower than the page, which is the whole trick:
      // it sits behind the text and reads as further away.
      gsap.to(".js-mark", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="story-heading"
      className="relative overflow-hidden border-t border-border/60 px-6 py-24 sm:py-32"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        className="js-mark pointer-events-none absolute -right-24 top-10 w-[26rem] max-w-none opacity-[0.045] sm:-right-16 lg:right-[4%] lg:w-[34rem]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-24">
        <header className="js-reveal gsap-hidden lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            Three kitchens
          </p>
          <h2
            id="story-heading"
            className="mt-4 font-display text-3xl leading-[1.08] tracking-tight sm:text-5xl"
          >
            One table,
            <br />
            <span className="text-accent-bright">three kitchens</span>
          </h2>
          <p className="mt-6 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            Most places pick a lane. We never could. So the charcoal grill, the
            wok and the pizza oven all run at once — and nobody at your table
            has to settle.
          </p>
        </header>

        <div className="js-pillars relative pl-10 sm:pl-14">
          {/* The thread the markers hang from. */}
          <span
            aria-hidden="true"
            /* 5.5px, not a spacing step: the markers are 12px wide and sit at
               x=0, so their centres are at 6px and the 1px spine has to start
               half a pixel back from that to line up under them. */
            className="js-spine gsap-hidden absolute left-[5.5px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent via-accent/50 to-transparent"
          />

          <ol className="space-y-12 sm:space-y-16">
            {storyPillars.map((pillar, i) => (
              <li key={pillar.title} className="js-reveal gsap-hidden relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-10 top-2 flex h-3 w-3 items-center justify-center rounded-full border border-accent bg-background sm:-left-14"
                >
                  <span className="h-1 w-1 rounded-full bg-accent-bright" />
                </span>

                <p className="font-display text-sm text-accent/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  {pillar.line}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
