"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { interiorPreview } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

export default function InteriorPreview() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 28 });

      // `once` so the reveal never replays, and each item animates on its own
      // trigger rather than from one page-level timeline.
      gsap.utils.toArray(".js-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  const [featured, ...rest] = interiorPreview;

  return (
    <section
      ref={root}
      className="relative border-t border-border/60 px-6 py-20 sm:py-28"
      aria-labelledby="interior-heading"
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="js-reveal gsap-hidden text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.32em] text-accent-bright">
            A first look
          </p>
          <h2
            id="interior-heading"
            className="mt-4 font-display text-3xl tracking-tight sm:text-4xl"
          >
            Inside the bistro
          </h2>
          <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-muted">
            Mosaic arches, brass lanterns and deep green banquettes — a taste of
            the room we&apos;re building for you.
          </p>
        </header>

        <figure className="js-reveal gsap-hidden mt-14">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={featured.src}
              alt={featured.alt}
              width={1600}
              height={800}
              priority={false}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-xs tracking-wide text-muted">
            {featured.caption}
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {rest.map((shot) => (
            <figure key={shot.src} className="js-reveal gsap-hidden">
              <div className="overflow-hidden rounded-2xl border border-border">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1600}
                  height={800}
                  sizes="(max-width: 640px) 100vw, 496px"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs tracking-wide text-muted">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="js-reveal gsap-hidden mt-12 text-center text-[0.7rem] leading-relaxed text-muted/70">
          Artist&apos;s impressions — the finished space may differ.
          <br className="sm:hidden" />
          <span className="sm:ml-1">Interior design by Aaron Designs.</span>
        </p>
      </div>
    </section>
  );
}
