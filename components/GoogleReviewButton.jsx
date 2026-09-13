"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Star } from "lucide-react";

export default function GoogleReviewButton() {
  const container = useRef(null);

  const { contextSafe } = useGSAP({ scope: container });

  const onMouseEnter = contextSafe(() => {
    gsap.killTweensOf(".review-star");
    gsap.to(".review-star", {
      y: -4,
      scale: 1.15,
      rotate: 10,
      duration: 0.3,
      stagger: {
        each: 0.05,
        yoyo: true,
        repeat: 1,
      },
      ease: "power2.out",
    });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.killTweensOf(".review-star");
    gsap.to(".review-star", {
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  return (
    <div className="js-link gsap-hidden mt-8 mb-4">
      <a
        ref={container}
        href="https://g.page/r/Cbky-ziHWvdTEAI/review"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-accent/20 bg-surface px-6 py-6 transition-colors hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
      >
        {/* Subtle animated gradient background on hover */}
        <div className="pointer-events-none absolute -inset-[200%] animate-[spin_10s_linear_infinite] opacity-0 transition-opacity duration-700 group-hover:opacity-20" style={{ background: "conic-gradient(from 0deg, transparent 0 340deg, var(--accent) 360deg)" }} />
        
        {/* Background Pattern */}
        <div className="menu-lattice pointer-events-none absolute inset-0 opacity-5 transition-opacity duration-300 group-hover:opacity-10" style={{ backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 flex gap-1.5 text-accent">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="review-star drop-shadow-md"
              fill="currentColor"
              strokeWidth={1.5}
              size={24}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center">
          <span className="block text-sm font-semibold text-foreground group-hover:text-accent-bright transition-colors">
            Rate us on Google
          </span>
          <span className="mt-1 block text-xs text-muted">
            Your feedback helps us serve you better
          </span>
        </div>
      </a>
    </div>
  );
}
