"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { signatureDishes, dishCategories } from "@/lib/site";
import { resolvePicks, menuStats, money } from "@/lib/home";
import { addLine, useOrder } from "@/lib/orderStore";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";
import { MosqueIcon } from "@/components/MenuIcons";

gsap.registerPlugin(ScrollTrigger);

const DISHES = resolvePicks(signatureDishes);
const TOTAL_DISHES = menuStats().dishes;

/* Tabs that would come up empty (every pick in them renumbered away) are
   dropped rather than offered. */
const CATEGORIES = dishCategories
  .map((category) => ({
    ...category,
    count:
      category.id === "all"
        ? DISHES.length
        : DISHES.filter((dish) => dish.category === category.id).length,
  }))
  .filter((category) => category.count > 0);

/* The printed menu letters its variant rows a, b, c. */
const LETTERS = "abcdefgh";

/*
 * Tapping a price adds that line to the order /menu builds. The row flashes a
 * tick, and carries a count once the line is in the order.
 */
function useAdd(item, variant) {
  const { qtyOf } = useOrder();
  const [flash, setFlash] = useState(false);
  const add = () => {
    addLine(item, variant);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
  };
  return { qty: qtyOf(item, variant), flash, add };
}

function AddMark({ qty, flash }) {
  if (flash) {
    return <Check size={13} strokeWidth={3} className="text-menu-green" />;
  }
  if (qty) {
    return (
      <span className="inline-flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-menu-green px-1 text-[0.6rem] font-bold text-menu-cream">
        {qty}
      </span>
    );
  }
  return (
    <Plus
      size={13}
      strokeWidth={2.5}
      className="hidden text-accent-bright opacity-40 transition-opacity group-hover/row:opacity-100 group-focus-visible/row:opacity-100 sm:block"
    />
  );
}

/** One lettered row under a dish: "a  Chicken  RM 19.90", tap to add. */
function VariantRow({ item, variant, letter }) {
  const { qty, flash, add } = useAdd(item, variant);
  return (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${item.name}, ${variant.label}, RM ${money(variant.price)}`}
      className={`group/row grid w-full grid-cols-[0.7rem_minmax(0,1fr)_auto_auto] items-center gap-x-1.5 rounded-md px-1 py-[3px] text-left text-[0.78rem] leading-tight sm:grid-cols-[0.9rem_minmax(0,1fr)_auto_1.1rem] sm:gap-x-2 sm:px-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-accent-bright sm:text-sm ${
        flash || qty ? "bg-accent/15" : "hover:bg-accent/10"
      }`}
    >
      <span className="text-menu-ink/55">{letter}</span>
      <span className="text-menu-ink">{variant.label}</span>
      <span className="font-bold tabular-nums text-menu-green">
        RM {money(variant.price)}
      </span>
      <span className="flex justify-end">
        <AddMark qty={qty} flash={flash} />
      </span>
    </button>
  );
}

/** A single-price dish sets its price straight after the name, as printed. */
function InlinePrice({ item }) {
  const { qty, flash, add } = useAdd(item, null);
  return (
    <button
      type="button"
      onClick={add}
      aria-label={`Add ${item.name}, RM ${money(item.price)}`}
      className={`group/row inline-flex items-center gap-1.5 rounded-md px-1.5 py-[3px] font-bold tabular-nums text-menu-green transition-colors focus-visible:outline-2 focus-visible:outline-accent-bright ${
        flash || qty ? "bg-accent/15" : "hover:bg-accent/10"
      }`}
    >
      RM {money(item.price)}
      <AddMark qty={qty} flash={flash} />
    </button>
  );
}

/**
 * One dish, set the way the printed menu sets it: the photo, the number and
 * name beneath, and lettered price rows under that.
 *
 * The photo is shown as shot — the studio frame, not cut out — in a rounded
 * frame with a gold hairline, and eases in a little on hover.
 */
function DishItem({ dish, hidden }) {
  const { item, photo } = dish;
  return (
    <article className={`flex flex-col ${hidden ? "hidden" : ""}`} data-dish>
      <div className="js-plate gsap-hidden group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-accent/25 bg-white shadow-[0_18px_36px_-24px_rgba(90,62,15,0.45)]">
        <Image
          src={photo}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 290px, (min-width: 640px) 30vw, 46vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>

      <div className="js-text gsap-hidden mt-3 sm:px-1">
        <h3 className="flex flex-wrap items-center gap-x-2 gap-y-0.5 px-1.5 text-[0.9rem] text-menu-ink sm:text-[0.98rem]">
          <span className="tabular-nums text-menu-ink/60">{item.no}</span>
          <span className="font-medium">{item.name}</span>
          {item.variants ? null : <InlinePrice item={item} />}
        </h3>
        {item.variants ? (
          <div className="mt-1 max-w-[17rem]">
            {item.variants.map((variant, i) => (
              <VariantRow
                key={variant.label}
                item={item}
                variant={variant}
                letter={LETTERS[i]}
              />
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function SignatureDishes() {
  const root = useRef(null);
  const tabs = useRef({});
  const reveals = useRef([]);
  const entering = useRef(false);
  const [filter, setFilter] = useState("all");

  const partsOf = (articles) =>
    articles.flatMap((el) => [
      el.querySelector(".js-plate"),
      el.querySelector(".js-text"),
    ]);
  const shown = () =>
    gsap.utils
      .toArray("[data-dish]", root.current)
      .filter((el) => !el.classList.contains("hidden"));

  // Scroll reveal, once, a row at a time.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 30 });
      gsap.utils.toArray(".js-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.set([".js-plate", ".js-text"], { y: 26 });
      reveals.current = ScrollTrigger.batch("[data-dish]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(partsOf(batch), {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
          }),
      });
    },
    { scope: root },
  );

  // The pill sits under whichever tab is chosen. Re-measured when the web
  // font lands (it changes every tab's width) and on resize.
  const placeIndicator = (animate) => {
    const tab = tabs.current[filter];
    if (!tab) return;
    gsap.to(".js-indicator", {
      x: tab.offsetLeft,
      width: tab.offsetWidth,
      duration: animate && !prefersReducedMotion() ? 0.5 : 0,
      ease: "power3.inOut",
    });
  };

  // A plain effect rather than useGSAP: its cleanup has to run on every
  // filter change, or each old listener would keep measuring its own tab.
  useEffect(() => {
    const replace = () => placeIndicator(false);
    document.fonts?.ready.then(replace);
    window.addEventListener("resize", replace);
    return () => window.removeEventListener("resize", replace);
  });

  // Every filter change: slide the indicator, and bring the new set in.
  useGSAP(
    () => {
      placeIndicator(true);
      if (!entering.current) return;
      entering.current = false;
      gsap.fromTo(
        partsOf(shown()),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.04,
          // The section just changed height; everything below needs its
          // scroll positions re-measured.
          onComplete: () => ScrollTrigger.refresh(),
        },
      );
    },
    { scope: root, dependencies: [filter] },
  );

  const choose = (id) => {
    if (id === filter) return;
    // Someone choosing a filter is looking at the grid: anything still
    // waiting on its scroll reveal is done waiting.
    reveals.current.forEach((trigger) => trigger.kill());
    reveals.current = [];

    if (prefersReducedMotion()) {
      setFilter(id);
      return;
    }
    // The current set steps out, then the new one steps in (the effect
    // above). Opacity and transform land on the plate and text themselves,
    // never the article — see DishItem.
    gsap.to(partsOf(shown()), {
      opacity: 0,
      y: -10,
      duration: 0.22,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        entering.current = true;
        setFilter(id);
      },
    });
  };

  return (
    <section
      ref={root}
      id="dishes"
      aria-labelledby="signatures-heading"
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28"
    >
      {/* The printed menu's patterned ground. */}
      <div
        aria-hidden="true"
        className="lazeez-pattern pointer-events-none absolute inset-0 opacity-[0.1]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="js-reveal gsap-hidden flex flex-col items-center text-center">
          <MosqueIcon className="h-14 w-auto text-accent sm:h-16" />
          <div className="mt-5 flex w-full items-center gap-5 sm:gap-8">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent" />
            <h2
              id="signatures-heading"
              className="font-display text-3xl font-semibold tracking-tight text-menu-green sm:text-5xl"
            >
              Our Signature Plates
            </h2>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <p className="mt-4 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-base">
            A handful from the full menu. Tap any price to add it to your
            order — it goes to us on WhatsApp when you&apos;re ready.
          </p>
        </header>

        <div
          role="group"
          aria-label="Filter dishes"
          className="js-reveal gsap-hidden -mx-5 mt-9 overflow-x-auto px-5 pb-1 text-center [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative inline-flex rounded-full border border-accent/30 bg-surface/80 p-1">
            <span
              aria-hidden="true"
              className="js-indicator absolute left-0 top-1 bottom-1 rounded-full bg-primary"
              style={{ width: 0 }}
            />
            {CATEGORIES.map((category) => {
              const isActive = category.id === filter;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabs.current[category.id] = el;
                  }}
                  type="button"
                  onClick={() => choose(category.id)}
                  aria-pressed={isActive}
                  className={`relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright ${
                    isActive
                      ? "font-medium text-primary-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {category.label}
                  <span
                    className={`text-[0.65rem] tabular-nums ${
                      isActive ? "text-primary-foreground/70" : "text-muted/60"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4">
          {DISHES.map((dish) => (
            <DishItem
              key={dish.no}
              dish={dish}
              hidden={filter !== "all" && dish.category !== filter}
            />
          ))}
        </div>

        <div className="js-reveal gsap-hidden mt-16 flex flex-col items-center gap-4 text-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            See all {TOTAL_DISHES} dishes on the menu
            <ArrowRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p className="text-xs text-muted/80">
            Images for illustration purposes only · All prices are subject to 6%
            SST
          </p>
        </div>
      </div>
    </section>
  );
}
