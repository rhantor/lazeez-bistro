"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, ArrowUpRight } from "lucide-react";
import { site, whatsappNumber, socialLinks, visit } from "@/lib/site";
import { useOrder } from "@/lib/orderStore";
import { OPEN_ORDER_EVENT } from "@/components/OrderBar";

/*
 * The home page's own header. It is deliberately not in the root layout: /menu
 * runs the light theme and carries its own sticky category rail, and /link-tree
 * is a single focused card — neither wants a second bar over the top of it.
 *
 * In-page entries carry the id of the section they jump to, which is also what
 * the scroll-spy below watches to light up the one being read.
 */
const NAV = [
  { label: "Signatures", href: "#dishes", id: "dishes" },
  { label: "Kitchens", href: "#kitchens", id: "kitchens" },
  { label: "Visit", href: "#visit", id: "visit" },
  { label: "Menu", href: "/menu" },
];

const SOCIALS = socialLinks.filter((link) =>
  ["Instagram", "TikTok", "WhatsApp"].includes(link.label),
);

export default function HomeHeader() {
  // Transparent over the hero, then a tinted blur once the page has moved.
  const [lifted, setLifted] = useState(false);
  // Tucks away while reading down the page and comes back on the way up.
  const [tucked, setTucked] = useState(false);
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef(null);
  const { count } = useOrder();

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setLifted(y > 24);
      // A few pixels of dead band so a trackpad's jitter doesn't flicker it.
      if (Math.abs(y - lastY) > 6) {
        setTucked(y > lastY && y > 480);
        lastY = y;
      }
      // Written straight to the element: a state update per scroll frame
      // would re-render the whole header sixty times a second.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) {
        progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Scroll-spy: a section counts as "being read" while it crosses a band just
  // under the header, so the highlight changes as a heading reaches the top
  // rather than when the section's last pixel leaves.
  useEffect(() => {
    const targets = NAV.filter((entry) => entry.id)
      .map((entry) => document.getElementById(entry.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
          else if (entry.boundingClientRect.top > 0) {
            // Scrolled back above this section: nothing below is active yet.
            setActive((current) =>
              current === entry.target.id ? null : current,
            );
          }
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  // The open mobile menu owns the screen: no page scroll behind it, and
  // Escape closes it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openOrder = () => window.dispatchEvent(new Event(OPEN_ORDER_EVENT));

  const visible = !tucked || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          lifted || menuOpen
            ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="relative z-10 shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            {/* The standard logo, in green ink for the cream ground. (The
                -light variant is the cream-ink one, for dark grounds.) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-horizontal.svg"
              alt={site.name}
              width={180}
              height={40}
              className="h-8 w-auto sm:h-9"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-border/60 bg-surface/40 p-1 backdrop-blur-md md:flex"
          >
            {NAV.map((entry) => {
              const isActive = entry.id && active === entry.id;
              return (
                <Link
                  key={entry.label}
                  href={entry.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative rounded-full px-4 py-1.5 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright ${
                    isActive
                      ? "bg-accent/15 text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {entry.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            {count > 0 ? (
              <button
                type="button"
                onClick={openOrder}
                className="relative inline-flex items-center gap-2 rounded-full border border-accent/50 bg-surface/70 px-4 py-2 text-sm text-foreground transition-colors hover:border-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
              >
                <ShoppingBag size={16} strokeWidth={1.75} className="text-accent-bright" />
                <span className="hidden sm:inline">Your order</span>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-bright px-1.5 text-[0.7rem] font-bold text-background tabular-nums">
                  {count}
                </span>
              </button>
            ) : (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright sm:inline-flex"
              >
                Order now
              </a>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-foreground transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Reading progress. Drawn as a transform so it never triggers layout. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden"
        >
          <span
            ref={progress}
            className="block h-full w-full origin-left bg-gradient-to-r from-accent via-accent-bright to-brand-sand"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </header>

      {/* Mobile menu. Kept mounted so it can fade out as well as in. */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col bg-background/95 px-6 pb-10 pt-24 backdrop-blur-xl transition-opacity duration-400 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          aria-hidden="true"
          className="lazeez-pattern pointer-events-none absolute inset-0 opacity-[0.1]"
        />
        <nav aria-label="Mobile" className="relative flex flex-col">
          {NAV.map((entry, i) => (
            <Link
              key={entry.label}
              href={entry.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
              className={`group flex items-center justify-between border-b border-border/60 py-5 font-display text-4xl tracking-tight transition-all duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span>
                <span className="mr-4 align-middle font-sans text-xs text-accent/80 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {entry.label}
              </span>
              <ArrowUpRight
                size={22}
                strokeWidth={1.5}
                className="text-accent-bright transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </nav>

        <div className="relative mt-auto space-y-5">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground"
          >
            Order on WhatsApp
          </a>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>{visit.venue}</span>
            <div className="flex gap-2">
              {SOCIALS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-accent-bright"
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
