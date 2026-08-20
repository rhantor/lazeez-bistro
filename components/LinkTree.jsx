"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { site, socialLinks } from "@/lib/site";
import {
  prefersReducedMotion,
  revealAll,
  playWhenVisible,
} from "@/lib/useIntroTimeline";

export default function LinkTree() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      // See ComingSoon: GSAP owns the transforms, not Tailwind utilities.
      gsap.set(".js-head > *", { y: 12 });
      gsap.set(".js-link", { y: 16 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(".js-head > *", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.09,
      })
        .to(
          ".js-link",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
          "-=0.35",
        )
        .to(".js-back", { opacity: 1, duration: 0.6 }, "-=0.3");

      return playWhenVisible(tl);
    },
    { scope: root },
  );

  return (
    <main
      ref={root}
      className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-14 sm:py-20"
    >
      <div className="ambient-glow pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative w-full max-w-md">
        {/* The lockup carries the name as artwork, so the heading is for
            screen readers and search engines only. */}
        <h1 className="sr-only">
          {site.name} — {site.cuisines.join(", ")}
        </h1>

        <header className="js-head flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-primary-light.svg"
            alt=""
            width={322}
            height={449}
            className="gsap-hidden w-48 max-w-full sm:w-52"
          />
          <p className="gsap-hidden mt-6 text-sm text-muted">{site.tagline}</p>
        </header>

        <ul className="mt-11 flex flex-col gap-3">
          {socialLinks.map(({ label, handle, href, icon: Icon }) => {
            const isExternal = href.startsWith("http");

            return (
              <li key={label} className="js-link gsap-hidden">
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-accent/60 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-accent-bright transition-colors group-hover:bg-accent group-hover:text-background">
                    <Icon size={19} strokeWidth={1.75} />
                  </span>

                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block truncate text-xs text-muted">
                      {handle}
                    </span>
                  </span>

                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="js-back gsap-hidden mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
