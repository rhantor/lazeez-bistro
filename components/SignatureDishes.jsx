"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { signatureDishes } from "@/lib/site";
import { menuMeta, findMenuItem, lowestPrice } from "@/lib/menu";
import { prefersReducedMotion, revealAll } from "@/lib/useIntroTimeline";

gsap.registerPlugin(ScrollTrigger);

/*
 * Resolved once at module scope: the picks in lib/site.js are menu numbers,
 * and this joins each to the live item so the price on a card is the price on
 * the menu. A number that no longer exists (a dish renumbered in the print)
 * drops out rather than rendering a blank card.
 */
const DISHES = signatureDishes
  .map((pick) => {
    const item = findMenuItem(pick.no);
    return item ? { ...pick, item } : null;
  })
  .filter(Boolean);

const money = (value) => value.toFixed(2);

/** "RM 19.90", or "from RM 19.90" when the dish has variants to choose from. */
function Price({ item }) {
  return (
    <span className="shrink-0 font-display text-lg text-accent-bright">
      {item.variants ? (
        <span className="mr-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted">
          from
        </span>
      ) : null}
      <span className="tabular-nums">
        {menuMeta.currency} {money(lowestPrice(item))}
      </span>
    </span>
  );
}

function DishCard({ pick }) {
  const card = useRef(null);
  const tilt = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // A tilt that tracks the pointer has no meaning on a touch screen — it
      // would fire once per tap and read as a glitch — so it is wired up only
      // where a real pointer can hover.
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (!canHover) return;

      const to = (prop) =>
        gsap.quickTo(".js-face", prop, { duration: 0.6, ease: "power3.out" });
      tilt.current = { rotX: to("rotationX"), rotY: to("rotationY") };
    },
    { scope: card },
  );

  // The sheen is a CSS radial gradient positioned from --mx/--my, the same
  // pointer-tracking trick /menu's cards use. Written as custom properties
  // rather than tweened, so it costs nothing on GSAP's ticker.
  const handlePointerMove = (event) => {
    const bounds = card.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    card.current.style.setProperty("--mx", `${px * 100}%`);
    card.current.style.setProperty("--my", `${py * 100}%`);

    if (!tilt.current) return;
    tilt.current.rotY((px - 0.5) * 12);
    tilt.current.rotX((py - 0.5) * -12);
  };

  const handlePointerLeave = () => {
    if (!tilt.current) return;
    tilt.current.rotX(0);
    tilt.current.rotY(0);
  };

  const { item, blurb } = pick;

  return (
    <article
      ref={card}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      /* min-w-0: a grid item's automatic minimum size is its content's
         min-content width, so without this the price row below refuses to
         shrink and the whole card grows past its track on a narrow screen. */
      className="js-reveal gsap-hidden scene-3d group relative min-w-0"
    >
      {/*
        The gold hairline is the 1px of padding on this wrapper: the gradient
        fills the rounded box and the opaque panel inside covers all of it but
        that one-pixel ring. Done this way rather than with a mask, which would
        need the ring expressed as padding regardless.
      */}
      <div className="js-face preserve-3d relative h-full rounded-2xl p-px">
        <span
          aria-hidden="true"
          className="card-edge pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-70"
        />

        <div className="relative flex h-full flex-col rounded-[calc(1rem-1px)] border border-border bg-surface p-6 transition-colors duration-500 group-hover:border-accent/45 sm:p-7">
          {/* Above the panel, below the content, never in the way of a
              pointer event. */}
          <span
            aria-hidden="true"
            className="card-sheen pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <div
            className="depth relative flex items-start gap-5"
            style={{ "--z": "26px" }}
          >
            {item.image ? (
              // The photos are square on a cream ground rather than cut out on
              // transparency, so they are cropped to a circle — `object-cover`,
              // not `object-contain`, or the cream corners come with them.
              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-accent/40">
                <Image
                  src={item.image}
                  alt=""
                  width={228}
                  height={228}
                  sizes="80px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </span>
            ) : (
              // No photograph for this dish: the number printed on the menu
              // stands in as a monogram rather than leaving a hole in the row.
              <span
                aria-hidden="true"
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-background/50 font-display text-2xl text-accent/70 transition-colors duration-500 group-hover:text-accent-bright"
              >
                {item.no}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-accent/80">
                {item.page}
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug tracking-tight">
                {item.name}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {blurb}
              </p>
              {/* The variant labels sit under the price rather than beside it.
                  Side by side there is only room for them on the widest cards,
                  and "Chicke…" is worse than no caption at all. */}
              <div className="mt-4">
                <Price item={item} />
                {item.variants ? (
                  <p className="mt-1.5 text-xs text-muted">
                    {item.variants.map((variant) => variant.label).join(" · ")}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SignatureDishes() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        revealAll();
        return;
      }

      gsap.set(".js-reveal", { y: 34 });

      // Each card rides its own trigger rather than one section timeline, so
      // a visitor who lands mid-page never scrolls past an already-spent
      // reveal. `once` keeps them from replaying on the way back up.
      gsap.utils.toArray(".js-reveal").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          // Cards come into view a row at a time, so the offset is by column
          // within the row rather than a running index — otherwise the last
          // card on the page would trail the first by several seconds.
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="signatures-heading"
      className="relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <header className="js-reveal gsap-hidden mx-auto max-w-2xl text-center">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-accent-bright">
            What to order first
          </p>
          <h2
            id="signatures-heading"
            className="mt-4 font-display text-3xl tracking-tight sm:text-5xl"
          >
            The plates we&apos;re known for
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance text-sm leading-relaxed text-muted sm:text-base">
            A handful from the full list. The rest is waiting on the menu page.
          </p>
        </header>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((pick) => (
            <DishCard key={pick.no} pick={pick} />
          ))}
        </div>

        <div className="js-reveal gsap-hidden mt-14 flex justify-center">
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2.5 rounded-full border border-accent/40 px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright"
          >
            See the full menu
            <ArrowRight
              size={17}
              strokeWidth={2}
              className="text-accent-bright transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
