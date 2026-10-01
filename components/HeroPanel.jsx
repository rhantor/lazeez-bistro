"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site } from "@/lib/site";
import { FRAME } from "@/lib/frame";
import { prefersReducedMotion, canHover } from "@/lib/useIntroTimeline";

/*
 * The frame drawing, in the PDF's units. PAD leaves room round the outer
 * shape for the gold ring and its shadow.
 */
const PAD = 24;
const VB_W = FRAME.width + PAD * 2;
const VB_H = FRAME.height + PAD * 2;
const CX = FRAME.width / 2;
const CY = FRAME.height / 2;
// The gold ring runs ~9 units outside the panel edge, the way the printed
// menu's frame line stands off its centre panel.
const RING_SX = (FRAME.width + 18) / FRAME.width;
const RING_SY = (FRAME.height + 18) / FRAME.height;

/**
 * The hero's right-hand side: the printed menu's centre panel — the Moorish
 * frame, embossed into the cream, the logo at its heart.
 *
 * The frame is SVG (outlines lifted from the menu PDF, see lib/frame.js); the
 * emboss is an inset shadow filter where the print stacks graded fills.
 */
/*
 * Where along a path its topmost point falls, as a fraction of its length.
 * The frame's outline starts on its right-hand side, not at the peak, so the
 * draw-in needs to know where the peak is to grow out from it.
 */
function apexOf(path) {
  const total = path.getTotalLength();
  let best = 0;
  let top = Infinity;
  for (let i = 0; i <= 400; i += 1) {
    const { y } = path.getPointAtLength((total * i) / 400);
    if (y < top) {
      top = y;
      best = i / 400;
    }
  }
  return best;
}

/*
 * Draws a path (pathLength="1") outward from its peak: one dash, centred on
 * the peak, growing both ways round until its ends meet at the foot. The
 * dash pattern repeats every 1, so a dash that runs past the path's start
 * simply wraps round to its end.
 */
function drawFromApex(path, vars) {
  const apex = apexOf(path);
  const state = { length: 0 };
  const write = () => {
    const l = state.length;
    path.style.strokeDasharray = `${l} ${1 - l + 0.001}`;
    path.style.strokeDashoffset = `${l / 2 - apex}`;
  };
  write();
  return gsap.to(state, { length: 1, onUpdate: write, ...vars });
}

export default function HeroPanel() {
  const root = useRef(null);
  const tilt = useRef(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // Reduced motion: everything simply there, lines drawn in full.
      if (reduced) {
        gsap.set([".js-body", ".js-logo"], { opacity: 1 });
        gsap.set([".js-ring", ".js-inline"], {
          strokeDasharray: "none",
          strokeDashoffset: 0,
        });
        return;
      }

      // The entrance: the gold border traces itself from the frame's peak
      // down both sides to meet at the foot, the inner line follows, and
      // only then does the cream panel fill in and the logo arrive.
      gsap.set(".js-panel", { scale: 0.97, y: 16 });
      gsap.set(".js-body", { opacity: 0 });
      gsap.set(".js-logo", { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(".js-panel", { scale: 1, y: 0, duration: 2.2, ease: "expo.out" }, 0)
        .add(
          drawFromApex(root.current.querySelector(".js-ring"), {
            duration: 1.8,
            ease: "power2.inOut",
          }),
          0,
        )
        .add(
          drawFromApex(root.current.querySelector(".js-inline"), {
            duration: 1.5,
            ease: "power2.inOut",
          }),
          0.45,
        )
        .to(".js-body", { opacity: 1, duration: 1.1, ease: "power2.out" }, 1.1)
        .to(".js-logo", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 1.5);

      // Everything below is desktop-only: the sheen repaints the frame's SVG
      // filters on every frame it moves, which a phone feels while scrolling.
      if (!canHover()) return;

      // A band of light that sweeps the panel now and then.
      gsap.fromTo(
        ".js-sheen",
        { x: -VB_W },
        { x: VB_W * 1.2, duration: 2.4, ease: "power2.inOut", repeat: -1, repeatDelay: 5, delay: 3.2 },
      );

      // The tilt follows the pointer.
      const to = (target, prop) =>
        gsap.quickTo(target, prop, { duration: 1, ease: "power3.out" });
      tilt.current = {
        rotX: to(".js-tilt", "rotationX"),
        rotY: to(".js-tilt", "rotationY"),
      };
    },
    { scope: root },
  );

  const handlePointerMove = (event) => {
    if (!tilt.current) return;
    const bounds = root.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    tilt.current.rotY(px * 8);
    tilt.current.rotX(py * -6);
  };

  const handlePointerLeave = () => {
    if (!tilt.current) return;
    Object.values(tilt.current).forEach((to) => to(0));
  };

  return (
    <div
      ref={root}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:mr-8 lg:max-w-[27rem]"
    >
      <div className="scene-3d">
        <div
          className="js-tilt js-panel preserve-3d relative w-full"
          style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
        >
          <svg
            viewBox={`${-PAD} ${-PAD} ${VB_W} ${VB_H}`}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="hero-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#a0805c" />
                <stop offset="0.35" stopColor="#d9bd78" />
                <stop offset="0.6" stopColor="#9b8235" />
                <stop offset="1" stopColor="#c9a24a" />
              </linearGradient>
              <linearGradient id="hero-sheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              {/* The emboss: a soft shadow cast inward from the edge, the
                  way the printed panel looks pressed into the paper. */}
              <filter id="hero-inset" x="-10%" y="-10%" width="120%" height="120%">
                <feFlood floodColor="#6f5b35" floodOpacity="0.32" />
                <feComposite in2="SourceAlpha" operator="out" />
                <feGaussianBlur stdDeviation="4" />
                <feOffset dy="2" />
                <feComposite in2="SourceAlpha" operator="in" result="inset" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="inset" />
                </feMerge>
              </filter>
              <filter id="hero-lift" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#5a3e0f" floodOpacity="0.22" />
              </filter>
              <clipPath id="hero-clip">
                <path d={FRAME.outer} />
              </clipPath>
            </defs>

            <path
              className="js-ring"
              d={FRAME.outer}
              pathLength="1"
              strokeDasharray="0 1"
              fill="none"
              stroke="url(#hero-gold)"
              strokeWidth="2.6"
              transform={`translate(${CX} ${CY}) scale(${RING_SX} ${RING_SY}) translate(${-CX} ${-CY})`}
            />
            {/* Starts hidden in the server HTML (gsap-hidden, and the two
                lines at zero length) so the finished panel never flashes
                up before the entrance plays. */}
            <g className="js-body gsap-hidden">
              <g filter="url(#hero-lift)">
                <path d={FRAME.outer} fill="#faf6ee" filter="url(#hero-inset)" />
              </g>
              <path d={FRAME.inner} fill="#fdfaf4" filter="url(#hero-inset)" />
            </g>
            <path
              className="js-inline"
              d={FRAME.inner}
              pathLength="1"
              strokeDasharray="0 1"
              fill="none"
              stroke="#c9a24a"
              strokeOpacity="0.6"
              strokeWidth="0.9"
            />

            <g clipPath="url(#hero-clip)">
              <rect
                className="js-sheen"
                x="0"
                y={-PAD}
                width="90"
                height={VB_H}
                fill="url(#hero-sheen)"
                transform="skewX(-18)"
              />
            </g>
          </svg>

          {/* The logo itself, as the menu sets it: lantern in its arch, the
              name, and the three kitchens. */}
          {/* Centred by flex, not a translate: GSAP animates this image's
              transform, and would bake a percentage translate into pixels
              measured before the SVG had loaded. */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-primary.svg"
              alt={`${site.name} — ${site.cuisines.join(", ")}`}
              width={322}
              height={449}
              className="js-logo gsap-hidden w-[55%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
