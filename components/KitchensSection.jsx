"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { kitchens } from "@/lib/site";
import { lowestPrice } from "@/lib/menu";
import { resolvePicks, pageItemCount, money } from "@/lib/home";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";
import MoorishFrame from "@/components/MoorishFrame";
import { MosqueIcon, HibiscusIcon, ClocheIcon } from "@/components/MenuIcons";

gsap.registerPlugin(ScrollTrigger);

/* Resolved once: each kitchen's card lists its picks at their menu prices. */
const KITCHENS = kitchens.map((kitchen) => ({
  ...kitchen,
  count: pageItemCount(kitchen.pageId),
  dishes: resolvePicks(
    kitchen.picks.map((pick) => (typeof pick === "number" ? { no: pick } : pick)),
  ).map((pick) => pick.item),
}));

/* Each kitchen under the icon the printed menu heads its page with. */
const ICONS = { arabic: MosqueIcon, malaysian: HibiscusIcon, western: ClocheIcon };

/* Seconds a kitchen holds the card before the next is shown, until the
   visitor picks one themselves. */
const HOLD = 7;

export default function KitchensSection() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const touched = useRef(false);
  const inView = useRef(false);
  const timer = useRef(null);

  const choose = (i) => {
    // A deliberate choice ends the tour: the card stays where they put it.
    touched.current = true;
    timer.current?.kill();
    setActive(i);
  };

  // Once: scroll reveals, the drifting mark, and tracking whether the section
  // is on screen so the tour only runs while someone can see it.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        end: "bottom 30%",
        onToggle: (self) => {
          inView.current = self.isActive;
          if (!timer.current) return;
          if (self.isActive) timer.current.resume();
          else timer.current.pause();
        },
      });

      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 30 });
      gsap.utils.toArray(".js-reveal").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: (i % 4) * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.set(".js-card", { y: 60, rotation: 2 });
      gsap.to(".js-card", {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".js-card", start: "top 85%", once: true },
      });

      // The logo mark drifts slower than the page: it sits behind the text
      // and reads as further away.
      gsap.to(".js-mark", {
        yPercent: -22,
        rotation: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  // Each kitchen: bring the card's contents in, and run the tour's clock.
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (!reduced) {
        gsap.fromTo(
          ".js-panel > *",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.045, ease: "power3.out" },
        );
        gsap.fromTo(
          ".js-script",
          { opacity: 0, scale: 0.85, rotation: -4 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.6)" },
        );
      }

      timer.current?.kill();
      timer.current = null;
      gsap.set(".js-bar", { scaleX: 0 });
      if (reduced || touched.current) return;

      timer.current = gsap.to(`[data-bar="${active}"]`, {
        scaleX: 1,
        duration: HOLD,
        ease: "none",
        onComplete: () => setActive((active + 1) % KITCHENS.length),
      });
      if (!inView.current) timer.current.pause();
    },
    { scope: root, dependencies: [active] },
  );

  // Arrow keys move along the tabs, as a tablist should.
  const onKeyDown = (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + KITCHENS.length) % KITCHENS.length;
    choose(next);
    root.current.querySelector(`#kitchen-tab-${next}`)?.focus();
  };

  const kitchen = KITCHENS[active];
  const Icon = ICONS[kitchen.id] ?? MosqueIcon;

  return (
    <section
      ref={root}
      id="kitchens"
      aria-labelledby="kitchens-heading"
      className="home-dark relative overflow-hidden bg-background px-5 py-24 text-foreground sm:px-8 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="lazeez-pattern pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        className="js-mark pointer-events-none absolute -left-40 top-24 w-[34rem] max-w-none opacity-[0.07]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-24">
        <div>
          <p className="js-reveal gsap-hidden flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            <span className="h-px w-8 bg-accent" />
            Three kitchens
          </p>
          <h2
            id="kitchens-heading"
            className="js-reveal gsap-hidden mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            One table,
            <br />
            <span className="italic text-accent-bright">three kitchens</span>
          </h2>
          <p className="js-reveal gsap-hidden mt-6 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            Most places pick a lane. We never could. So the charcoal grill, the
            wok and the pizza oven all run at once — and nobody at your table
            has to settle.
          </p>

          <div
            role="tablist"
            aria-label="Our kitchens"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="js-reveal gsap-hidden mt-10 border-t border-border/70"
          >
            {KITCHENS.map((entry, i) => {
              const isActive = i === active;
              return (
                <button
                  key={entry.id}
                  id={`kitchen-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="kitchen-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => choose(i)}
                  className="group relative block w-full border-b border-border/70 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
                >
                  <span className="flex items-center gap-5">
                    <span
                      className={`font-display text-sm tabular-nums transition-colors duration-300 ${
                        isActive ? "text-accent-bright" : "text-muted/60"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-2xl tracking-tight transition-colors duration-300 sm:text-3xl ${
                        isActive
                          ? "text-foreground"
                          : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {entry.title}
                    </span>
                    <span className="ml-auto flex items-center gap-3 text-xs text-muted">
                      <span className="tabular-nums">{entry.count} dishes</span>
                      <ArrowRight
                        size={16}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "translate-x-0 text-accent-bright opacity-100"
                            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                      />
                    </span>
                  </span>

                  {/* The line opens under the chosen kitchen. The 0fr→1fr
                      row is how a height transitions to "auto". */}
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pl-10 pt-3 text-sm leading-relaxed text-muted sm:text-base">
                        {entry.line}
                      </span>
                    </span>
                  </span>

                  {/* The tour's clock, filling under the kitchen on show. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden"
                  >
                    <span
                      data-bar={i}
                      className="js-bar block h-full w-full origin-left bg-accent-bright"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The printed menu's centre-panel frame, the same one the hero
            carries, holding each kitchen's page. It stretches to fit. */}
        <div
          id="kitchen-panel"
          role="tabpanel"
          aria-labelledby={`kitchen-tab-${active}`}
          className="js-card gsap-hidden relative mx-auto w-full max-w-[29rem]"
        >
          <MoorishFrame className="text-menu-green">
            <div className="js-panel relative flex flex-col items-center text-center">
              <Icon className="h-10 w-auto text-accent sm:h-12" />
              <p
                lang="ar"
                dir="rtl"
                className="js-script mt-2 font-arabic text-3xl leading-none text-menu-gold sm:text-4xl"
              >
                {kitchen.arabic}
              </p>
              <h3 className="mt-2 font-display text-[1.7rem] font-semibold leading-tight tracking-tight sm:text-4xl">
                {kitchen.title} Kitchen
              </h3>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.28em] text-menu-ink/60">
                A taste of {kitchen.count} dishes
              </p>
              <span
                aria-hidden="true"
                className="mt-4 flex w-full items-center gap-3 text-menu-gold"
              >
                <span className="h-px flex-1 bg-menu-gold/50" />
                <span className="text-xs">&#10022;</span>
                <span className="h-px flex-1 bg-menu-gold/50" />
              </span>
            </div>

            <ul className="js-panel relative mt-5 space-y-2.5 sm:space-y-3">
              {kitchen.dishes.map((item) => (
                <li key={item.no} className="flex items-baseline gap-2 text-left">
                  <span className="w-7 shrink-0 text-[0.62rem] tabular-nums text-menu-ink/45">
                    {item.no}
                  </span>
                  <span className="text-[0.85rem] font-medium leading-snug text-menu-ink sm:text-[0.95rem]">
                    {item.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-1 min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-menu-green/30"
                  />
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-menu-green">
                    {item.variants ? (
                      <span className="mr-1 text-[0.6rem] font-normal uppercase tracking-wider text-menu-ink/50">
                        from
                      </span>
                    ) : null}
                    {money(lowestPrice(item))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="js-panel relative mt-7 flex justify-center">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-full bg-menu-green px-6 py-3 text-sm font-medium text-menu-cream transition-colors hover:bg-menu-green-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-menu-green"
              >
                The full {kitchen.title.toLowerCase()} menu
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </MoorishFrame>
        </div>
      </div>
    </section>
  );
}
