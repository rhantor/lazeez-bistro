"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { menuPages, menuMeta } from "@/lib/menu";
import { prefersReducedMotion } from "@/lib/useIntroTimeline";
import DishRow from "@/components/DishRow";
import OrderBar from "@/components/OrderBar";

/** The rail has no room for the full page titles. */
const TAB_LABELS = {
  "italian-and-western-cuisine": "Italian & Western",
  "malaysian-local-favourites": "Malaysian",
  // "Beverage & Dessert" already fits, so it falls through to the page title.
};

export default function MenuExperience() {
  const root = useRef(null);
  const rail = useRef(null);
  const indicator = useRef(null);
  const buttons = useRef({});
  const [activeId, setActiveId] = useState(menuPages[0].id);

  const page = menuPages.find((p) => p.id === activeId) ?? menuPages[0];
  const itemCount = page.sections.reduce(
    (sum, section) => sum + section.items.length,
    0,
  );

  // Re-runs on every tab change, so switching category deals the new rows in
  // rather than swapping them instantly.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".js-panel-3d", ".js-row", ".js-group", ".js-page-head"], {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
        });
        return;
      }

      // An elegant, premium fade and slide-up animation
      gsap.set([".js-panel-3d", ".js-page-head", ".js-group", ".js-row"], {
        opacity: 0,
      });
      gsap.set([".js-page-head", ".js-group"], { y: 20 });
      gsap.set(".js-row", { y: 30 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".js-panel-3d", { opacity: 1, duration: 0.4 })
        .to(".js-page-head", { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to(".js-group", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.2)
        .to(
          ".js-row",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: { each: Math.min(0.05, 2 / itemCount), from: "start" },
          },
          0.3,
        );
    },
    { dependencies: [activeId], scope: root },
  );

  useGSAP(
    () => {
      const button = buttons.current[activeId];
      if (!button || !indicator.current) return;

      const target = { x: button.offsetLeft, width: button.offsetWidth };
      const isFirstPlacement = indicator.current.offsetWidth === 0;

      if (isFirstPlacement || prefersReducedMotion()) {
        gsap.set(indicator.current, target);
      } else {
        gsap.to(indicator.current, {
          ...target,
          duration: 0.45,
          ease: "power3.out",
        });
      }

      const track = rail.current;
      if (track && track.scrollWidth > track.clientWidth) {
        track.scrollTo({
          left:
            button.offsetLeft - track.clientWidth / 2 + button.offsetWidth / 2,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    },
    { dependencies: [activeId], scope: root },
  );

  const selectTab = (id) => {
    setActiveId(id);
    // Jump back to the top of the list, or switching category from halfway
    // down a long one leaves you stranded in the middle of the next.
    root.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={root} className="scroll-mt-[4.5rem]">
      <nav
        aria-label="Menu categories"
        className="sticky top-0 z-30 border-b border-accent/30 bg-background/85 backdrop-blur-xl shadow-sm shadow-accent/5"
      >
        <div
          ref={rail}
          className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex gap-1">
            <span
              ref={indicator}
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-0 rounded-full bg-accent/20 ring-1 ring-inset ring-accent/50 shadow-[0_2px_12px_rgba(201,162,74,0.15)]"
            />
            {menuPages.map((menuPage) => (
              <button
                key={menuPage.id}
                type="button"
                ref={(el) => {
                  buttons.current[menuPage.id] = el;
                }}
                onClick={() => selectTab(menuPage.id)}
                aria-current={activeId === menuPage.id ? "true" : undefined}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright ${
                  activeId === menuPage.id
                    ? "text-accent-bright font-semibold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {TAB_LABELS[menuPage.id] ?? menuPage.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* pb leaves room for the sticky order bar to sit over the last rows. */}
      <div className="js-panel-3d mx-auto w-full max-w-3xl px-5 pb-40 pt-14 sm:px-6">
        <header className="js-page-head text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            {page.title}
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted">
            {itemCount} dishes
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </header>

        {page.sections.map((section) => (
          <section key={section.name} className="js-group mt-14">
            <div className="flex items-center justify-center gap-5 text-center">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-accent/70" />
              <h3 className="font-display text-2xl text-foreground">
                {section.name}
              </h3>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-accent/70" />
            </div>

            <ul className="mt-2">
              {section.items.map((item) => (
                <DishRow key={item.no} item={item} />
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-16 text-center text-xs leading-relaxed text-muted/70">
          {menuMeta.footnote}
        </p>
      </div>

      <OrderBar />
    </div>
  );
}
