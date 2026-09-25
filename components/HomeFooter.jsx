"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { site, socialLinks } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

/*
 * The four social accounts, in the order the link tree lists them. The other
 * entries in socialLinks are contact details and a placeholder ordering link,
 * which the Visit section already covers.
 */
const SOCIALS = socialLinks.filter((link) =>
  ["Instagram", "TikTok", "YouTube", "WhatsApp"].includes(link.label),
);

export default function HomeFooter() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 24 });

      gsap.to(".js-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="relative border-t border-border/60 px-6 py-16 sm:py-20"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-primary-light.svg"
          alt={`${site.name} — ${site.cuisines.join(", ")}`}
          width={322}
          height={449}
          className="js-reveal gsap-hidden w-24"
        />

        <p className="js-reveal gsap-hidden mt-6 font-display text-lg tracking-tight text-brand-sand">
          {site.tagline}
        </p>

        <ul className="js-reveal gsap-hidden mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {SOCIALS.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:bg-surface-hover hover:text-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.75}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <nav
          aria-label="Footer"
          className="js-reveal gsap-hidden mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted"
        >
          <Link
            href="/menu"
            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            Menu
          </Link>
          <Link
            href="/link-tree"
            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            All our links
          </Link>
          <a
            href="#top"
            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            Back to top
          </a>
        </nav>

        <p className="js-reveal gsap-hidden mt-10 text-xs text-muted/70">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
