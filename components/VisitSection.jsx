"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, Clock, Phone, Mail, ArrowUpRight, Navigation, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { site, visit, whatsappNumber, socialLinks } from "@/lib/site";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

const phone = socialLinks.find((link) => link.label === "Call Us");
const email = socialLinks.find((link) => link.label === "Email");

const CONTACTS = [
  phone && { icon: Phone, label: "Call", value: phone.handle, href: phone.href },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Message or order",
    href: `https://wa.me/${whatsappNumber}`,
    external: true,
  },
  email && { icon: Mail, label: "Email", value: email.handle, href: email.href },
  visit.reviewUrl && {
    icon: Star,
    label: "Google reviews",
    value: "Tell us how we did",
    href: visit.reviewUrl,
    external: true,
  },
].filter(Boolean);

// The keyless embed: a Maps search rendered as an iframe. No API key, no
// script on our side — just the frame.
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  visit.mapQuery,
)}&z=17&output=embed`;

function CardLabel({ icon: Icon, children }) {
  return (
    <p className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.24em] text-accent-bright">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-background/40">
        <Icon size={14} strokeWidth={1.75} />
      </span>
      {children}
    </p>
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
          delay: (i % 3) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.set(".js-map", { clipPath: "inset(12% 12% 12% 12% round 1.5rem)" });
      gsap.to(".js-map", {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: ".js-map", start: "top 85%", once: true },
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
      className="relative overflow-hidden border-t border-border/60 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="js-glow ambient-glow pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-7xl">
        <header className="js-reveal gsap-hidden max-w-2xl">
          <p className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            <span className="h-px w-8 bg-accent" />
            Come and eat
          </p>
          <h2
            id="visit-heading"
            className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            Find us at{" "}
            <span className="italic text-accent-bright">{visit.venue}</span>
          </h2>
          <p className="mt-5 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            Walk in and pull up a chair, or send your order ahead on WhatsApp
            and we&apos;ll have it ready when you arrive.
          </p>
        </header>

        <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="js-reveal gsap-hidden rounded-3xl border border-border bg-surface/70 p-6 backdrop-blur-sm sm:p-7">
              <CardLabel icon={MapPin}>Where</CardLabel>
              <address className="mt-5 not-italic text-base leading-relaxed text-foreground/90">
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
                className="group mt-5 inline-flex items-center gap-2 text-sm text-accent-bright transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
              >
                <Navigation size={14} strokeWidth={2} />
                Get directions
                <ArrowUpRight
                  size={15}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            <div className="js-reveal gsap-hidden rounded-3xl border border-border bg-surface/70 p-6 backdrop-blur-sm sm:p-7">
              <CardLabel icon={Clock}>When</CardLabel>
              {visit.hours.length ? (
                <dl className="mt-5 space-y-3.5 text-sm sm:text-base">
                  {visit.hours.map((row) => (
                    <div
                      key={row.days}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/60 pb-3.5 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted">{row.days}</dt>
                      <dd className="tabular-nums text-foreground/90">{row.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                // No confirmed hours in lib/site.js yet: point to the people
                // who know, rather than print a placeholder.
                <div className="mt-5">
                  <p className="font-display text-xl text-foreground">Planning a visit?</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    Call or WhatsApp us for today&apos;s hours and table
                    availability.
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 text-sm text-accent-bright transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
                  >
                    Ask on WhatsApp
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              )}
            </div>

            <div className="js-reveal gsap-hidden rounded-3xl border border-border bg-surface/70 p-2 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <ul className="divide-y divide-border/60">
                {CONTACTS.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <li key={contact.label}>
                      <a
                        href={contact.href}
                        {...(contact.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-bright transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon size={17} strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                            {contact.label}
                          </span>
                          <span className="block truncate text-sm text-foreground sm:text-base">
                            {contact.value}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={17}
                          className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="js-map gsap-hidden relative min-h-[24rem] overflow-hidden rounded-3xl border border-border bg-surface sm:min-h-[28rem]">
            {/*
              Google's own tiles, warmed a touch with sepia so their blues and
              greys sit with the cream page rather than against it.
            */}
            <iframe
              src={MAP_SRC}
              title={`Map showing ${site.name} at ${visit.venue}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.22)_saturate(0.85)_contrast(0.97)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-accent/20"
            />
            {/* Nothing of ours sits over the frame: Google's place card,
                controls and attribution all need to stay visible. */}
          </div>
        </div>
      </div>
    </section>
  );
}
