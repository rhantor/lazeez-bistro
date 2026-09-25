"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site, whatsappNumber } from "@/lib/site";

/*
 * The home page's own header. It is deliberately not in the root layout: /menu
 * runs the light theme and carries its own sticky category rail, and /link-tree
 * is a single focused card — neither wants a second bar over the top of it.
 */
const NAV = [
  { label: "Menu", href: "/menu" },
  { label: "Visit", href: "#visit" },
  { label: "Links", href: "/link-tree" },
];

export default function HomeHeader() {
  // Transparent over the hero, then a tinted blur once the page has moved, so
  // the bar stays legible over the sections below without ever boxing in the
  // hero art.
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        lifted
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link
          href="/"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
        >
          {/* The -light variant is the one drawn in cream ink, for dark
              grounds. The standard one would vanish here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-horizontal-light.svg"
            alt={site.name}
            width={180}
            height={40}
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-1 sm:gap-2"
        >
          {NAV.map((entry) => (
            <Link
              key={entry.label}
              href={entry.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright sm:px-4"
            >
              {entry.label}
            </Link>
          ))}

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright sm:inline-flex"
          >
            Order
          </a>
        </nav>
      </div>
    </header>
  );
}
