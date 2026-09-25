"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { interiorPreview } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

/*
 * The renders as a full-bleed sequence you scroll through.
 *
 * The track is tall and the stage inside it is `sticky`, so the stage holds
 * still while the track's height is consumed — the same effect as
 * ScrollTrigger's `pin`, but done in CSS, so nothing injects a pin-spacer into
 * the layout and the section can never end up double-spaced.
 *
 * `interiorPreview` puts the featured render first, which is the right one to
 * open on, so the order is taken as-is.
 */
const SLIDES = interiorPreview;

/* Scroll time, in timeline units, that each render holds the screen. */
const SPAN = 1;
/* How much of that is spent crossfading into the next one. */
const FADE = 0.45;

export default function InteriorPreview() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      // Reduced motion gets the CSS fallback below — a plain stacked gallery,
      // no sticky stage, no scroll-driven anything — so nothing is built here.
      if (prefersReducedMotion()) return;

      const slides = gsap.utils.toArray(".js-slide");
      const ticks = gsap.utils.toArray(".js-tick-fill");

      /*
       * Builds the whole sequence. `motion` decides what the render itself does
       * while it holds the screen — see the two matchMedia branches below.
       */
      const build = (motion) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track.current,
            start: "top top",
            end: "bottom bottom",
            // Scrubbed rather than played: the sequence advances at exactly the
            // rate the reader scrolls, which is what makes it feel like moving
            // through the room rather than watching a slideshow.
            scrub: 0.6,
          },
        });

        slides.forEach((slide, i) => {
          const shot = slide.querySelector(".js-shot");
          const caption = slide.querySelector(".js-cap");
          // When this render becomes the top layer.
          const enter = i * SPAN;
          // Runs from just before the render appears to just after it is
          // covered, so the movement never visibly starts or stops while this
          // is the render being looked at.
          const at = Math.max(0, enter - FADE);
          const span = SPAN + FADE * 2;

          if (motion === "push") {
            tl.fromTo(
              shot,
              { scale: 1.04 },
              { scale: 1.2, ease: "none", duration: span },
              at,
            );
          } else {
            /*
             * A slow pan across the room instead of a push-in.
             *
             * These are 2:1 renders, and object-cover fits them to a portrait
             * phone by height — which leaves only about a quarter of the room
             * on screen, and zooming in would show even less. Sliding the crop
             * window instead walks across roughly 90% of the render over the
             * slide, so the whole room still gets seen, just over time.
             *
             * Driven through a numeric proxy rather than tweening the
             * `object-position` string directly, so there is no dependency on
             * how a shorthand with two values gets interpolated.
             */
            const [from, to] = i % 2 ? [90, 10] : [10, 90];
            const pan = { x: from };
            const write = () => {
              shot.style.objectPosition = `${pan.x}% 50%`;
            };
            write();

            tl.fromTo(
              pan,
              { x: from },
              { x: to, ease: "none", duration: span, onUpdate: write },
              at,
            );
          }

          /*
           * Only the incoming render fades; the one beneath stays put. Stacked
           * this way each slide is simply revealed over the last, which
           * crossfades without ever showing the page through a gap where two
           * half-faded layers would otherwise overlap.
           */
          if (i > 0) {
            tl.fromTo(
              slide,
              { opacity: 0 },
              { opacity: 1, ease: "power1.inOut", duration: FADE },
              enter - FADE,
            );
          }

          tl.fromTo(
            caption,
            { yPercent: 70, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: "power2.out",
              duration: FADE * 1.3,
            },
            i === 0 ? 0.05 : enter - FADE * 0.4,
          );

          /*
           * And out again as the next render arrives. The slide underneath
           * keeps its opacity, so without this its caption reads straight
           * through the incoming one and two headlines sit on top of each
           * other for the length of the crossfade.
           */
          if (i < slides.length - 1) {
            tl.to(
              caption,
              { opacity: 0, ease: "power1.in", duration: FADE * 0.7 },
              (i + 1) * SPAN - FADE,
            );
          }

          tl.fromTo(
            ticks[i],
            { scaleX: 0 },
            { scaleX: 1, ease: "none", duration: SPAN },
            enter,
          );
        });
      };

      /*
       * Wide enough that object-cover still shows most of the room: push in.
       * Narrower than that it shows a slice, so pan across instead. Rebuilt on
       * resize, and each branch reverts its own tweens on the way out.
       */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => build("push"));
      mm.add("(max-width: 1023px)", () => {
        build("pan");
        // object-position is written as an inline style, which is outside
        // anything GSAP tracks, so it has to be cleared by hand — otherwise a
        // resize up to the wide layout keeps the last panned crop.
        return () => {
          slides.forEach((slide) => {
            slide.querySelector(".js-shot").style.objectPosition = "";
          });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="interior-heading"
      className="relative border-t border-border/60"
    >
      <header className="mx-auto w-full max-w-2xl px-6 pb-14 pt-24 text-center sm:pb-16 sm:pt-32">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
          A first look
        </p>
        <h2
          id="interior-heading"
          className="mt-4 font-display text-3xl tracking-tight sm:text-5xl"
        >
          Inside the bistro
        </h2>
        <p className="mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
          Mosaic arches, brass lanterns and deep green banquettes — a taste of
          the room we&apos;re building for you.
        </p>
      </header>

      {/*
        The track is only there to be scrolled through: its height is the length
        of the sequence. Under reduced motion it collapses to its content and
        the stage stops sticking, which turns the whole thing back into an
        ordinary stacked gallery.
      */}
      <div
        ref={track}
        className="relative h-[280svh] motion-reduce:h-auto"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:space-y-4 motion-reduce:overflow-visible">
          {SLIDES.map((shot, i) => (
            <div
              key={shot.src}
              className={`js-slide absolute inset-0 motion-reduce:relative motion-reduce:inset-auto motion-reduce:aspect-[2/1] ${
                // The first render is the bottom layer and stays opaque; the
                // rest start hidden and are revealed over it.
                i > 0 ? "gsap-hidden" : ""
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="100vw"
                className="js-shot object-cover object-center"
              />

              {/* Sits the render into the site's palette and keeps the caption
                  legible over the brighter parts of the room. */}
              <span
                aria-hidden="true"
                /* Solid at the foot so the caption always has something to sit
                   on, clear through the middle so the room is actually visible,
                   and darkened again at the head so the fixed header reads
                   over it. A flat wash across the whole frame greyed out the
                   part of the render worth looking at. */
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/45"
              />

              <div className="absolute inset-x-0 bottom-0 px-6 pb-24 sm:pb-28">
                <div className="js-cap gsap-hidden mx-auto w-full max-w-6xl">
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
                    {`${String(i + 1).padStart(2, "0")} / ${String(
                      SLIDES.length,
                    ).padStart(2, "0")}`}
                  </p>
                  <p className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-5xl">
                    {shot.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Progress along the sequence. Meaningless without the scroll
              choreography, so it goes away with it. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-10 px-6 motion-reduce:hidden sm:bottom-12"
          >
            <div className="mx-auto flex w-full max-w-6xl gap-2">
              {SLIDES.map((shot) => (
                <span
                  key={shot.src}
                  className="h-px flex-1 overflow-hidden bg-foreground/20"
                >
                  {/* The empty start state is an inline transform, not
                      Tailwind's `scale-x-0`: v4 compiles that to the standalone
                      `scale` property, which GSAP's transform writes would not
                      override (same reason ComingSoon sets its own). */}
                  <span
                    className="js-tick-fill block h-full w-full origin-left bg-accent-bright"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto w-full max-w-2xl px-6 pb-24 pt-14 text-center text-[0.7rem] leading-relaxed text-muted/70 sm:pb-32">
        Artist&apos;s impressions — the finished space may differ.
        <br className="sm:hidden" />
        <span className="sm:ml-1">Interior design by Aaron Designs.</span>
      </p>
    </section>
  );
}
