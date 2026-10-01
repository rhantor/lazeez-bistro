"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUp } from "lucide-react";
import { site, socialLinks, visit, whatsappNumber } from "@/lib/site";
import { menuMeta } from "@/lib/menu";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

/*
 * The four social accounts, in the order the link tree lists them. The other
 * entries in socialLinks are contact details, which get their own column.
 */
const SOCIALS = socialLinks.filter((link) =>
  ["Instagram", "TikTok", "YouTube", "WhatsApp"].includes(link.label),
);
const phone = socialLinks.find((link) => link.label === "Call Us");
const email = socialLinks.find((link) => link.label === "Email");

const EXPLORE = [
  { label: "Full menu", href: "/menu" },
  { label: "Signature dishes", href: "#dishes" },
  { label: "Our kitchens", href: "#kitchens" },
  { label: "Find us", href: "#visit" },
  { label: "All our links", href: "/link-tree" },
];

const linkClass =
  "text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright";

function Column({ title, children }) {
  return (
    <div className="js-reveal gsap-hidden">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-bright">
        {title}
      </p>
      <div className="mt-5 flex flex-col gap-3">{children}</div>
    </div>
  );
}

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
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
      });

      // The wordmark rises out of the foot of the page as it comes into view.
      gsap.fromTo(
        ".js-wordmark",
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".js-wordmark",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="home-dark relative overflow-hidden bg-background px-5 pt-20 text-foreground sm:px-8"
    >
      <div
        aria-hidden="true"
        className="lazeez-pattern pointer-events-none absolute inset-0 opacity-[0.06]"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="js-reveal gsap-hidden sm:col-span-2 lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-horizontal-light.svg"
              alt={site.name}
              width={220}
              height={50}
              className="h-11 w-auto"
            />
            <p className="mt-5 max-w-xs font-display text-xl italic text-brand-sand">
              {site.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.cuisines.join(", ")} — three kitchens under one roof at{" "}
              {visit.venue}.
            </p>
            <ul className="mt-7 flex flex-wrap items-center gap-2.5">
              {SOCIALS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:bg-accent hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
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
          </div>

          <Column title="Explore">
            {EXPLORE.map((entry) => (
              <Link key={entry.label} href={entry.href} className={linkClass}>
                {entry.label}
              </Link>
            ))}
          </Column>

          <Column title="Visit">
            <address className="not-italic text-sm leading-relaxed text-muted">
              {visit.addressLines.map((line) => (
                <span key={line.text} className="block">
                  {line.text}
                </span>
              ))}
            </address>
            <a
              href={visit.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-bright transition-colors hover:text-foreground"
            >
              Get directions →
            </a>
          </Column>

          <Column title="Contact">
            {phone ? (
              <a href={phone.href} className={linkClass}>
                {phone.handle}
              </a>
            ) : null}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              WhatsApp us
            </a>
            {email ? (
              <a href={email.href} className={`${linkClass} break-all`}>
                {email.handle}
              </a>
            ) : null}
          </Column>
        </div>

        <div className="js-reveal gsap-hidden mt-16 flex flex-col-reverse items-center justify-between gap-4 border-t border-border/60 py-6 text-xs text-muted/70 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-center">{menuMeta.footnote}</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-muted transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            Back to top
            <ArrowUp
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* The name, set huge in gold outline, bleeding off the foot. */}
      <p
        aria-hidden="true"
        className="js-wordmark text-outline pointer-events-none relative -mb-[0.2em] select-none whitespace-nowrap text-center font-display text-[14vw] leading-none tracking-tight opacity-60"
      >
        {site.name}
      </p>
    </footer>
  );
}
