"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { site, hero, whatsappNumber } from "@/lib/site";
import {
  prefersReducedMotion,
  revealAll,
  playWhenVisible,
} from "@/lib/useIntroTimeline";

/*
 * The two dish medallions that drift behind the headline. These are the only
 * two photographed dishes we have (the /menu rows use the same files), so the
 * hero uses both and nothing else.
 *
 * `depth` scales how far each one lags the pointer — the larger plate sits
 * nearer the viewer and so moves more.
 */
const FLOATERS = [
  {
    src: "/menu/mandi.png",
    alt: "",
    // On a phone the text column runs nearly edge to edge, so the medallions
    // pull back to a sliver bleeding off the side. They come inboard at the
    // md breakpoint rather than sm, because the badge regains its venue text
    // at sm — both moving at once drove the plate through the end of the pill
    // at exactly 640px.
    className:
      "-right-16 top-[9%] w-28 md:-right-4 md:top-[14%] md:w-44 xl:right-[6%] xl:w-56",
    depth: 34,
    float: { y: -18, duration: 5.5 },
  },
  {
    src: "/menu/falafel.png",
    alt: "",
    className:
      // Fully inboard only at xl: the blurb column is a fixed 36rem, so at
      // 1024 it still reaches within 23px of where a lg-sized plate would sit.
      "-left-16 bottom-[10%] w-24 md:-left-6 md:bottom-[16%] md:w-36 xl:left-[7%] xl:w-44",
    depth: 22,
    float: { y: 16, duration: 6.5 },
  },
];

export default function HomeHero() {
  const root = useRef(null);
  const parallax = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      // See ComingSoon: Tailwind v4 compiles translate-*/scale-* to the
      // standalone `translate`/`scale` properties, which GSAP's transform
      // writes would not override. GSAP owns every starting transform here.
      gsap.set(".js-badge", { y: 14 });
      gsap.set(".js-line", { yPercent: 108 });
      gsap.set([".js-blurb", ".js-cta"], { y: 18 });
      gsap.set(".js-rule", { scaleX: 0 });
      gsap.set(".js-floater", { scale: 0.7, y: 40 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(".js-badge", { opacity: 1, y: 0, duration: 0.7 })
        .to(
          ".js-line",
          { opacity: 1, yPercent: 0, duration: 1.1, stagger: 0.12 },
          "-=0.35",
        )
        .to(".js-rule", { opacity: 1, scaleX: 1, duration: 0.9 }, "-=0.6")
        .to(".js-blurb", { opacity: 1, y: 0, duration: 0.8 }, "-=0.7")
        .to(
          ".js-cta",
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.55",
        )
        .to(
          ".js-floater",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.3,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=1.2",
        )
        .to(".js-cue", { opacity: 1, duration: 0.6 }, "-=0.3");

      // Ambient loops, started once the intro has laid everything down. Each
      // floater breathes on its own duration so the two never sync up.
      tl.add(() => {
        gsap.utils.toArray(".js-floater").forEach((el, i) => {
          gsap.to(el, {
            y: FLOATERS[i].float.y,
            rotation: i % 2 ? -4 : 4,
            duration: FLOATERS[i].float.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      });

      gsap.to(".js-glow", {
        opacity: 0.85,
        scale: 1.09,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Pointer parallax is a mouse affordance; on touch it would only fire
      // once per tap and read as a glitch, so it is set up only where a real
      // pointer can hover.
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (canHover) {
        const to = (target, prop) =>
          gsap.quickTo(target, prop, { duration: 1.1, ease: "power3.out" });
        parallax.current = {
          latticeX: to(".js-lattice", "x"),
          latticeY: to(".js-lattice", "y"),
          // xPercent, not x: the floaters' own y is already owned by the
          // breathing loop above, and writing x on a second axis keeps the
          // two from fighting over the same property.
          floaters: gsap.utils.toArray(".js-floater").map((el) => ({
            x: gsap.quickTo(el, "xPercent", {
              duration: 1.2,
              ease: "power3.out",
            }),
          })),
        };
      }

      return playWhenVisible(tl);
    },
    { scope: root },
  );

  const handlePointerMove = (event) => {
    if (!parallax.current) return;
    const bounds = root.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    // The lattice drifts against the pointer so the content reads as floating
    // in front of the pattern rather than printed onto it.
    parallax.current.latticeX(px * -30);
    parallax.current.latticeY(py * -18);
    parallax.current.floaters.forEach((floater, i) => {
      floater.x(px * FLOATERS[i].depth);
    });
  };

  const handlePointerLeave = () => {
    if (!parallax.current) return;
    parallax.current.latticeX(0);
    parallax.current.latticeY(0);
    parallax.current.floaters.forEach((floater) => floater.x(0));
  };

  return (
    <section
      ref={root}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-28 sm:pt-32"
    >
      {/* Sized past the section on every side so the parallax drift never
          exposes an edge of the tile. */}
      <div
        aria-hidden="true"
        className="js-lattice menu-lattice pointer-events-none absolute -inset-20 opacity-[0.07]"
      />
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-60" />

      {FLOATERS.map((floater) => (
        <div
          key={floater.src}
          aria-hidden="true"
          className={`js-floater gsap-hidden pointer-events-none absolute ${floater.className}`}
        >
          <div className="absolute inset-[6%] rounded-full bg-accent/30 blur-2xl" />
          {/*
            The dish photos are shot square on a cream ground, not cut out on
            transparency, so they are clipped to a circle and ringed in gold —
            the same medallion treatment the menu rows use. Left square they
            would read as a stray white box floating over the hero.
          */}
          <Image
            src={floater.src}
            alt={floater.alt}
            width={228}
            height={228}
            sizes="(min-width: 1280px) 224px, (min-width: 768px) 176px, 112px"
            className="relative aspect-square w-full rounded-full border border-accent/45 object-cover opacity-70 drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)] md:opacity-100"
          />
        </div>
      ))}

      <div className="relative flex w-full max-w-3xl flex-col items-center text-center">
        <p className="js-badge gsap-hidden inline-flex items-center gap-2.5 rounded-full border border-accent/35 bg-surface/70 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-brand-sand backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            {/* The ping is CSS, not GSAP — it is a two-keyframe loop with no
                timeline to coordinate with, and Tailwind already ships it. */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
          </span>
          {hero.badge}
          {/* The venue wraps the pill onto two lines on a phone, so below `sm`
              the badge says only that we are open — the Visit section and the
              header nav both carry the address anyway. */}
          <span aria-hidden="true" className="hidden text-muted sm:inline">
            ·
          </span>
          <span className="hidden text-muted sm:inline">{hero.place}</span>
        </p>

        <h1
          id="hero-heading"
          className="mt-8 font-display text-[clamp(2.75rem,10vw,5.5rem)] font-medium leading-[0.98] tracking-tight"
        >
          {hero.headline.map((line, i) => (
            // The clip is what makes the reveal read as a wipe: the inner span
            // starts fully below its own line box and slides up into it.
            // pb-[0.12em] keeps descenders from being shaved off.
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <span
                className={`js-line gsap-hidden block ${
                  i === hero.headline.length - 1 ? "text-accent-bright" : ""
                }`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="js-rule gsap-hidden mt-8 h-px w-48 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <p className="js-blurb gsap-hidden mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
          {hero.blurb}
        </p>

        <div className="mt-11 flex flex-col items-center gap-3.5 sm:flex-row">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="js-cta gsap-hidden group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            Order on WhatsApp
            <ArrowRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>

          <Link
            href="/menu"
            className="js-cta gsap-hidden group inline-flex items-center gap-2.5 rounded-full border border-accent/40 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            <UtensilsCrossed
              size={17}
              strokeWidth={1.75}
              className="text-accent-bright transition-transform duration-300 group-hover:-rotate-12"
            />
            View the menu
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="js-cue gsap-hidden absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        {/* Tighter tracking on a phone so the three cuisines stay on one line
            rather than breaking mid-list. */}
        <span className="whitespace-nowrap text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:text-[0.62rem] sm:tracking-[0.3em]">
          {site.cuisines.join(" · ")}
        </span>
        <span className="h-10 w-px bg-gradient-to-b from-accent/70 to-transparent" />
      </div>
    </section>
  );
}
