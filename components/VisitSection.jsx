"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, Clock, Phone, ArrowUpRight } from "lucide-react";
import { visit, whatsappNumber, socialLinks } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

const phone = socialLinks.find((link) => link.label === "Call Us");

/**
 * Renders a value from lib/site.js, marking the ones still carrying `todo` so
 * an unfilled placeholder is unmistakable on the page rather than passing for
 * a real address or a real opening time.
 */
function Value({ entry }) {
  if (!entry.todo) return entry.text ?? entry.time;
  return (
    <span className="italic text-muted/70 underline decoration-dashed decoration-from-font underline-offset-4">
      {entry.text ?? entry.time}
    </span>
  );
}

export default function VisitSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 30 });

      gsap.utils.toArray(".js-reveal").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: (i % 2) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.to(".js-glow", {
        opacity: 0.7,
        scale: 1.06,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="visit"
      aria-labelledby="visit-heading"
      className="relative overflow-hidden border-t border-border/60 px-6 py-24 sm:py-32"
    >
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-5xl">
        <header className="js-reveal gsap-hidden text-center">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            Come and eat
          </p>
          <h2
            id="visit-heading"
            className="mt-4 font-display text-3xl tracking-tight sm:text-5xl"
          >
            Find us at {visit.venue}
          </h2>
        </header>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          <div className="js-reveal gsap-hidden rounded-2xl border border-border bg-surface/60 p-7">
            <p className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.24em] text-accent-bright">
              <MapPin size={15} strokeWidth={1.75} />
              Where
            </p>
            <address className="mt-5 not-italic text-sm leading-relaxed text-foreground/90 sm:text-base">
              {visit.addressLines.map((line) => (
                <span key={line.text} className="block">
                  <Value entry={line} />
                </span>
              ))}
            </address>
            <a
              href={visit.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-accent-bright transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
            >
              {visit.mapLabel}
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="js-reveal gsap-hidden rounded-2xl border border-border bg-surface/60 p-7">
            <p className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.24em] text-accent-bright">
              <Clock size={15} strokeWidth={1.75} />
              When
            </p>
            <dl className="mt-5 space-y-3.5 text-sm sm:text-base">
              {visit.hours.map((row) => (
                <div
                  key={row.days}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/60 pb-3.5 last:border-0 last:pb-0"
                >
                  <dt className="text-muted">{row.days}</dt>
                  <dd className="tabular-nums text-foreground/90">
                    <Value entry={row} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="js-reveal gsap-hidden mt-12 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            Order on WhatsApp
            <ArrowUpRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          {phone ? (
            <a
              href={phone.href}
              className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
            >
              <Phone size={16} strokeWidth={1.75} className="text-accent-bright" />
              {phone.handle}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
