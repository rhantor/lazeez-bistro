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
 * The renders, two ways.
 *
 * Wide screens (lg+): a full-bleed sequence you scroll through. The track is
 * tall and the stage inside it is `sticky`, so the stage holds still while the
 * track's height is consumed — the same effect as ScrollTrigger's `pin`, but in
 * CSS, so nothing injects a pin-spacer into the layout.
 *
 * Phones and tablets: a plain stack of full-width images at their own 2:1
 * shape, captions beneath. The renders are 1600×800; a full-height phone
 * stage would crop a sliver of each and blow it up ~3×, which looks soft, and
 * scrubbing a full-screen image on every scroll frame is what made the
 * section stutter on a phone.
 *
 * The images are served as delivered (`unoptimized`): Next's re-encode at
 * quality 75 visibly softened renders that have no detail to spare.
 */
const SLIDES = interiorPreview;

/* Scroll time, in timeline units, that each render holds the screen. */
const SPAN = 1;
/* How much of that is spent crossfading into the next one. */
const FADE = 0.45;

const counter = (i) =>
  `${String(i + 1).padStart(2, "0")} / ${String(SLIDES.length).padStart(2, "0")}`;

export default function InteriorPreview() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      // Reduced motion gets the CSS fallback — the stacked gallery at every
      // width — so nothing is built here.
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const slides = gsap.utils.toArray(".js-slide");
        const ticks = gsap.utils.toArray(".js-tick-fill");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track.current,
            start: "top top",
            end: "bottom bottom",
            // Scrubbed rather than played: the sequence advances at exactly
            // the rate the reader scrolls.
            scrub: 0.6,
          },
        });

        slides.forEach((slide, i) => {
          const shot = slide.querySelector(".js-shot");
          const caption = slide.querySelector(".js-cap");
          const enter = i * SPAN;
          const at = Math.max(0, enter - FADE);
          const span = SPAN + FADE * 2;

          // A slow push-in. Kept small: the renders are 1600px wide, and a
          // big zoom on a large screen shows their softness.
          tl.fromTo(shot, { scale: 1 }, { scale: 1.08, ease: "none", duration: span }, at);

          // Only the incoming render fades; the one beneath stays put, so the
          // crossfade never shows the page through two half-faded layers.
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
            { yPercent: 0, opacity: 1, ease: "power2.out", duration: FADE * 1.3 },
            i === 0 ? 0.05 : enter - FADE * 0.4,
          );

          // And out again as the next render arrives, so two headlines never
          // sit on top of each other during the crossfade.
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
      });

      // Below lg: each image simply rises into place as it is reached.
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray(".js-card").forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="interior-heading"
      className="home-dark relative border-t border-border/60 bg-background text-foreground"
    >
      <header className="mx-auto w-full max-w-2xl px-6 pb-12 pt-24 text-center sm:pb-16 sm:pt-32">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
          Step inside
        </p>
        <h2
          id="interior-heading"
          className="mt-4 font-display text-3xl tracking-tight sm:text-5xl"
        >
          Inside the bistro
        </h2>
        <p className="mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
          Mosaic arches, brass lanterns and deep green banquettes — a room made
          for long dinners and big tables.
        </p>
      </header>

      {/* Phones and tablets (and reduced motion at every width). */}
      <div className="mx-auto w-full max-w-3xl space-y-10 px-5 lg:hidden motion-reduce:lg:block motion-reduce:lg:max-w-6xl">
        {SLIDES.map((shot, i) => (
          <figure key={shot.src} className="js-card">
            <div className="relative aspect-[2/1] overflow-hidden rounded-2xl border border-border">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                unoptimized
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline gap-4">
              <span className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
                {counter(i)}
              </span>
              <span className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                {shot.caption}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/*
        Wide screens. The track is only there to be scrolled through: its
        height is the length of the sequence.
      */}
      <div ref={track} className="relative hidden h-[280svh] lg:block motion-reduce:lg:hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {SLIDES.map((shot, i) => (
            <div
              key={shot.src}
              className={`js-slide absolute inset-0 ${
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
                unoptimized
                className="js-shot object-cover object-center"
              />

              {/* Solid at the foot so the caption has something to sit on,
                  clear through the middle so the room is visible, darkened
                  again at the head so the fixed header reads over it. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/45"
              />

              <div className="absolute inset-x-0 bottom-0 px-6 pb-28">
                <div className="js-cap gsap-hidden mx-auto w-full max-w-6xl">
                  <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
                    {counter(i)}
                  </p>
                  <p className="mt-3 font-display text-5xl leading-tight tracking-tight">
                    {shot.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Progress along the sequence. */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-12 px-6">
            <div className="mx-auto flex w-full max-w-6xl gap-2">
              {SLIDES.map((shot) => (
                <span key={shot.src} className="h-px flex-1 overflow-hidden bg-foreground/20">
                  {/* The empty start state is an inline transform, not
                      Tailwind's `scale-x-0`: v4 compiles that to the
                      standalone `scale` property, which GSAP's transform
                      writes would not override. */}
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
        Artist&apos;s impressions of the dining room.
        <br className="sm:hidden" />
        <span className="sm:ml-1">Interior design by Aaron Designs.</span>
      </p>
    </section>
  );
}
