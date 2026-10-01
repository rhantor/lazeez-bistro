"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { hero, whatsappNumber } from "@/lib/site";
import { menuStats } from "@/lib/home";
import {
  prefersReducedMotion,
  revealAll,
  playWhenVisible,
} from "@/lib/useIntroTimeline";
import HeroPanel from "@/components/HeroPanel";

const STATS = (() => {
  const { dishes, drinks, desserts } = menuStats();
  return [
    { value: dishes, label: "Dishes" },
    { value: drinks, label: "Drinks" },
    { value: desserts, label: "Desserts" },
  ];
})();

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
      gsap.set(".js-line", { yPercent: 110 });
      gsap.set([".js-blurb", ".js-cta", ".js-stats"], { y: 18 });
      gsap.set(".js-rule", { scaleX: 0 });

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
        .to(".js-rule", { opacity: 1, scaleX: 1, duration: 0.9 }, "-=1.1")
        .to(".js-blurb", { opacity: 1, y: 0, duration: 0.8 }, "-=0.9")
        .to(
          ".js-cta",
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.6",
        )
        .to(".js-stats", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        // The figures count up from zero as the row lands.
        .from(
          ".js-count",
          {
            textContent: 0,
            duration: 1.4,
            ease: "power2.out",
            snap: { textContent: 1 },
            stagger: 0.1,
          },
          "<",
        )
        .to(".js-cue", { opacity: 1, duration: 0.6 }, "-=0.6");

      gsap.to(".js-glow", {
        opacity: 0.85,
        scale: 1.09,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Pointer parallax is a mouse affordance; on touch it would only fire
      // once per tap and read as a glitch.
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (canHover) {
        const to = (target, prop) =>
          gsap.quickTo(target, prop, { duration: 1.1, ease: "power3.out" });
        parallax.current = {
          latticeX: to(".js-lattice", "x"),
          latticeY: to(".js-lattice", "y"),
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
  };

  const handlePointerLeave = () => {
    if (!parallax.current) return;
    parallax.current.latticeX(0);
    parallax.current.latticeY(0);
  };

  return (
    <section
      ref={root}
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Sized past the section on every side so the parallax drift never
          exposes an edge of the tile. */}
      <div
        aria-hidden="true"
        className="js-lattice lazeez-pattern pointer-events-none absolute -inset-20 opacity-[0.16]"
      />
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-60" />
      {/* A warm pool of light behind the logo panel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[#fffbf3] blur-[120px]"
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 lg:pb-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="js-badge gsap-hidden inline-flex items-center gap-2.5 rounded-full border border-accent/35 bg-surface/70 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-brand-sand backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              {/* The ping is CSS, not GSAP — a two-keyframe loop with no
                  timeline to coordinate with, and Tailwind already ships it. */}
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
            </span>
            {hero.badge}
          </p>

          <h1
            id="hero-heading"
            className="mt-7 font-display text-[clamp(3rem,11vw,6.75rem)] font-medium leading-[0.95] tracking-tight lg:text-[clamp(4rem,7vw,6.75rem)]"
          >
            {hero.headline.map((line, i) => (
              // The clip is what makes the reveal read as a wipe: the inner
              // span starts fully below its own line box and slides up into
              // it. pb-[0.12em] keeps descenders from being shaved off.
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <span
                  className={`js-line gsap-hidden block ${
                    i === hero.headline.length - 1
                      ? "italic text-accent-bright"
                      : ""
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="js-rule gsap-hidden mt-7 h-px w-40 origin-center bg-gradient-to-r from-transparent via-accent to-transparent lg:origin-left lg:from-accent lg:via-accent/60" />

          <p className="js-blurb gsap-hidden mt-7 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {hero.blurb}
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="js-cta gsap-hidden group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_14px_36px_-14px_rgba(15,61,36,0.55)] transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright sm:w-auto"
            >
              {/* A glint that sweeps the button on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
              />
              Order on WhatsApp
              <ArrowRight
                size={17}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/menu"
              className="js-cta gsap-hidden group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-accent/40 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright sm:w-auto"
            >
              <UtensilsCrossed
                size={17}
                strokeWidth={1.75}
                className="text-accent-bright transition-transform duration-300 group-hover:-rotate-12"
              />
              Explore the menu
            </Link>
          </div>

          <dl className="js-stats gsap-hidden mt-10 grid w-full max-w-md grid-cols-3 divide-x divide-border/70 rounded-2xl border border-border/70 bg-surface/40 backdrop-blur-sm">
            {STATS.map((stat) => (
              // dt before dd, as a <dl> requires; flex-col-reverse puts the
              // figure on top where the eye wants it.
              <div key={stat.label} className="flex flex-col-reverse items-center px-3 py-3.5 lg:items-start lg:px-5">
                <dt className="mt-0.5 text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </dt>
                <dd className="font-display text-2xl text-accent-bright tabular-nums sm:text-3xl">
                  <span className="js-count">{stat.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Runs its own entrance: the plates in it blend with the page, and
            an animated wrapper round them would cut them off from it. */}
        <HeroPanel />
      </div>

      <div
        aria-hidden="true"
        className="js-cue gsap-hidden absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="flex h-9 w-5 justify-center rounded-full border border-accent/40 pt-1.5">
          <span className="scroll-dot h-1.5 w-1 rounded-full bg-accent-bright" />
        </span>
        <span className="text-[0.58rem] uppercase tracking-[0.3em] text-muted">
          Scroll
        </span>
      </div>
    </section>
  );
}
