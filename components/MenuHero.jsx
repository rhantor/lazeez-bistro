"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { menuMeta } from "@/lib/menu";
import {
  prefersReducedMotion,
  revealAll,
  playWhenVisible,
} from "@/lib/useIntroTimeline";

const WORD = "menu";

export default function MenuHero() {
  const root = useRef(null);
  const parallax = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      // See ComingSoon: Tailwind v4 compiles translate-*/scale-* to standalone
      // properties, so GSAP sets the starting transforms itself.
      gsap.set(".js-logo", { scale: 1.06, rotationY: -14 });
      gsap.set(".js-rule", { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(".js-char", {
        rotationX: -92,
        y: 18,
        transformOrigin: "50% 100% -18px",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(".js-logo", { opacity: 1, scale: 1, rotationY: 0, duration: 1.5 })
        .to(".js-rule", { opacity: 1, scaleY: 1, duration: 0.8 }, "-=0.7")
        .to(
          ".js-char",
          { opacity: 1, rotationX: 0, y: 0, duration: 0.9, stagger: 0.08 },
          "-=0.45",
        )
        .to(".js-cue", { opacity: 1, duration: 0.6 }, "-=0.3");

      gsap.to(".js-glow", {
        opacity: 0.7,
        scale: 1.07,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (canHover) {
        const to = (target, prop) =>
          gsap.quickTo(target, prop, { duration: 0.9, ease: "power3.out" });
        parallax.current = {
          latticeX: to(".js-lattice", "x"),
          latticeY: to(".js-lattice", "y"),
          logoRotY: to(".js-logo", "rotationY"),
          logoX: to(".js-logo", "x"),
        };
      }

      return playWhenVisible(tl);
    },
    { scope: root },
  );

  // The lattice drifts opposite the cover, so the arch reads as sitting in
  // front of the pattern rather than printed onto it.
  const handlePointerMove = (event) => {
    if (!parallax.current) return;
    const bounds = root.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    parallax.current.latticeX(px * -26);
    parallax.current.latticeY(py * -16);
    parallax.current.logoX(px * 16);
    parallax.current.logoRotY(px * 10);
  };

  const handlePointerLeave = () => {
    if (!parallax.current) return;
    parallax.current.latticeX(0);
    parallax.current.latticeY(0);
    parallax.current.logoX(0);
    parallax.current.logoRotY(0);
  };

  // overflow-hidden clips the decorative layers that deliberately spill past
  // the section — the glow breathes to scale 1.08 and the lattice drifts —
  // either of which would put a horizontal scrollbar on a narrow viewport.
  // Safe here: the flattening rule applies to an element carrying preserve-3d
  // itself, and this one only supplies `perspective`.
  return (
    <section
      ref={root}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="scene-3d relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* The gold star lattice the printed menu runs behind everything. Sized
          larger than the section so the parallax drift never exposes an edge. */}
      <div
        aria-hidden="true"
        className="js-lattice menu-lattice pointer-events-none absolute -inset-16 opacity-[0.13]"
      />
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-55" />

      <div className="preserve-3d relative flex w-full max-w-xl flex-col items-center text-center">
        {/* The logo is the cover art: lantern hung inside a Moorish arch, with
            the wordmark beneath it. */}
        {/* The on-light logo: deep green wordmark and gold arch. The -light
            variant is the one for dark grounds (cream ink) and would vanish
            against this page's cream background. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-primary.svg"
          alt={`${menuMeta.restaurant} — ${menuMeta.tagline}`}
          width={322}
          height={449}
          className="js-logo gsap-hidden w-52 max-w-full sm:w-64"
        />

        {/* No tagline element here: logo-primary-light.svg already sets
            "ARABIC · MALAYSIAN · WESTERN" beneath the wordmark, exactly as the
            printed cover does. menuMeta.tagline goes to the image's alt text
            above instead of being drawn twice. */}

        <span
          aria-hidden="true"
          className="js-rule gsap-hidden mt-10 block h-16 w-px bg-gradient-to-b from-menu-gold/70 to-transparent"
        />

        <p
          className="scene-3d mt-8 font-display text-3xl uppercase tracking-[0.6em] text-accent-bright sm:text-4xl"
          aria-label={WORD}
        >
          {WORD.split("").map((char, i) => (
            <span
              key={`${char}-${i}`}
              aria-hidden="true"
              className="js-char gsap-hidden inline-block"
            >
              {char}
            </span>
          ))}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="js-cue gsap-hidden absolute bottom-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-menu-gold/60 to-transparent"
      />
    </section>
  );
}
