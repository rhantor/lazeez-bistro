"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import {
  prefersReducedMotion,
  revealAll,
  playWhenVisible,
} from "@/lib/useIntroTimeline";

const HEADLINE = "Coming Soon";

export default function ComingSoon() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      // Tailwind v4's translate-*/scale-* utilities compile to the standalone
      // `translate`/`scale` properties, which GSAP's transform writes would not
      // override. Own the starting transforms here instead.
      gsap.set(".js-logo", { scale: 0.94, y: 10 });
      gsap.set([".js-copy", ".js-cta"], { y: 12 });
      gsap.set(".js-char", { yPercent: 40 });
      gsap.set(".js-rule", { scaleX: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(".js-logo", { opacity: 1, scale: 1, y: 0, duration: 1 })
        .to(
          ".js-char",
          { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.045 },
          "-=0.45",
        )
        .to(".js-rule", { opacity: 1, scaleX: 1, duration: 0.9 }, "-=0.5")
        .to(".js-copy", { opacity: 1, y: 0, duration: 0.7 }, "-=0.6")
        .to(".js-cta", { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .to(".js-foot", { opacity: 1, duration: 0.6 }, "-=0.4");

      // Slow breathing glow behind the content.
      gsap.to(".js-glow", {
        opacity: 0.8,
        scale: 1.08,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return playWhenVisible(tl);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-16"
    >
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-55" />

      <div className="relative flex w-full max-w-2xl flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-primary-light.svg"
          alt={`${site.name} — ${site.cuisines.join(", ")}`}
          width={322}
          height={449}
          className="js-logo gsap-hidden w-40 max-w-full sm:w-52"
        />

        <h1
          className="mt-10 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          aria-label={HEADLINE}
        >
          {HEADLINE.split("").map((char, i) => (
            <span
              key={`${char}-${i}`}
              aria-hidden="true"
              className="js-char gsap-hidden inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div className="js-rule gsap-hidden mt-7 h-px w-40 bg-gradient-to-r from-transparent via-accent to-transparent" />

        <p className="js-copy gsap-hidden mt-7 max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg">
          We&apos;re putting the finishing touches on something delicious.{" "}
          <span className="text-brand-sand">{site.tagline}.</span>
        </p>

        <Link
          href="/link-tree"
          className="js-cta gsap-hidden group mt-10 inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
        >
          Follow our journey
          <ArrowRight
            size={17}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <p className="js-foot gsap-hidden mt-6 text-xs tracking-wide text-muted">
          All our links in one place
        </p>
      </div>

      <span
        aria-hidden="true"
        className="js-foot gsap-hidden absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-accent/70"
      />
    </section>
  );
}
