"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { galleryRows, socialLinks } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

const instagram = socialLinks.find((link) => link.label === "Instagram");

/* Seconds for one full pass of a row; the second row runs a touch slower so
   the two never line up. */
const PASS = [48, 56];

/**
 * Two rows of kitchen photos drifting in opposite directions. Each row holds
 * its tiles twice and slides exactly half its width before looping, the same
 * seamless trick as the cuisine ribbon. Hovering a row slows it to a crawl.
 * Under reduced motion the rows hold still and can be swiped instead.
 */
export default function GalleryMarquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 30 });
      gsap.to(".js-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });

      const cleanups = gsap.utils.toArray(".js-row").map((row, i) => {
        // Row one travels left, row two right.
        const tween = gsap.fromTo(
          row,
          { xPercent: i % 2 ? -50 : 0 },
          {
            xPercent: i % 2 ? 0 : -50,
            duration: PASS[i % 2],
            ease: "none",
            repeat: -1,
          },
        );
        const band = row.parentElement;
        const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.8 });
        const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.8 });
        band.addEventListener("pointerenter", slow);
        band.addEventListener("pointerleave", resume);

        // Nothing to animate while the wall is off screen.
        const visibility = ScrollTrigger.create({
          trigger: band,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        });

        return () => {
          visibility.kill();
          band.removeEventListener("pointerenter", slow);
          band.removeEventListener("pointerleave", resume);
        };
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden border-t border-border/60 py-24 sm:py-32"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="js-reveal gsap-hidden flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            <span className="h-px w-8 bg-accent" />
            From the pass
          </p>
          <h2
            id="gallery-heading"
            className="js-reveal gsap-hidden mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            Straight from{" "}
            <span className="italic text-accent-bright">our kitchen</span>
          </h2>
        </div>
        {instagram ? (
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="js-reveal gsap-hidden group inline-flex items-center gap-2.5 self-start rounded-full border border-accent/40 px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright md:self-auto"
          >
            <instagram.icon size={17} strokeWidth={1.75} className="text-accent-bright" />
            Follow {instagram.handle}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        ) : null}
      </div>

      <div className="js-reveal gsap-hidden mt-14 space-y-4 sm:space-y-5">
        {galleryRows.map((row, r) => (
          // The tween drives each row; under reduced motion there is no tween,
          // so the row scrolls sideways by hand instead. The mask fades the
          // tiles in and out at the edges.
          <div
            key={r}
            className="relative overflow-x-auto [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [scrollbar-width:none] motion-safe:overflow-x-hidden [&::-webkit-scrollbar]:hidden"
          >
            <div className="js-row flex w-max gap-4 sm:gap-5">
              {[0, 1].map((copy) =>
                row.map((tile) => (
                  <figure
                    key={`${copy}-${tile.src}`}
                    aria-hidden={copy === 1 ? "true" : undefined}
                    className={`group relative isolate h-56 shrink-0 overflow-hidden rounded-[1.75rem] border border-accent/30 bg-surface sm:h-72 ${
                      tile.wide ? "aspect-[4/3]" : "aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={tile.src}
                      alt={copy === 1 ? "" : tile.alt}
                      fill
                      sizes="(min-width: 640px) 384px, 300px"
                      // As exported: see the note in SignatureDishes.
                      unoptimized
                      className="object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-surface via-surface/85 to-transparent px-4 pb-3 pt-10 text-xs text-foreground transition-transform duration-500 group-hover:translate-y-0">
                      {tile.alt}
                    </figcaption>
                  </figure>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
