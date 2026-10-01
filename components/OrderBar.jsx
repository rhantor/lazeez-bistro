"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/BrandIcons";
import {
  useOrder,
  setQty,
  setNote,
  setDetails,
  clearOrder,
} from "@/lib/orderStore";
import { prefersReducedMotion } from "@/lib/useIntroTimeline";

const money = (value) => value.toFixed(2);

const ORDER_TYPES = ["Dine-in", "Takeaway", "Delivery"];

/*
 * Anything outside the bar can open the review sheet by dispatching this on
 * window — the home page header's basket button does. An event rather than
 * shared state so the bar stays the only owner of whether its sheet is open.
 */
export const OPEN_ORDER_EVENT = "lazeez:open-order";

export default function OrderBar() {
  const { lines, details, count, total, whatsappHref } = useOrder();
  const [open, setOpen] = useState(false);
  const bar = useRef(null);

  const hasOrder = count > 0;

  useEffect(() => {
    const open = () => setOpen(true);
    window.addEventListener(OPEN_ORDER_EVENT, open);
    return () => window.removeEventListener(OPEN_ORDER_EVENT, open);
  }, []);

  useGSAP(
    () => {
      if (!bar.current) return;
      if (prefersReducedMotion()) {
        gsap.set(bar.current, { y: 0, opacity: 1 });
        return;
      }
      // Slides up the first time something is added, and back down when the
      // order is emptied.
      gsap.to(bar.current, {
        y: hasOrder ? 0 : 120,
        opacity: hasOrder ? 1 : 0,
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { dependencies: [hasOrder] },
  );

  return (
    <>
      {/* Review sheet */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Close order"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            className="relative flex max-h-[88svh] w-full max-w-lg flex-col rounded-t-3xl border border-border bg-surface sm:rounded-3xl"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl">Your order</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-bright"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={line.key} className="border-b border-border/50 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="mr-1.5 text-xs tabular-nums text-muted">
                            {line.no}
                          </span>
                          {line.name}
                          {line.variant ? (
                            <span className="text-muted"> · {line.variant}</span>
                          ) : null}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          RM {money(line.price)} each
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label={`Reduce ${line.name}`}
                          className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-bright"
                        >
                          {line.qty === 1 ? (
                            <Trash2 size={14} />
                          ) : (
                            <Minus size={14} />
                          )}
                        </button>
                        <span className="w-5 text-center text-sm tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label={`Add another ${line.name}`}
                          className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-bright"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="w-16 text-right text-sm font-semibold tabular-nums text-accent-bright">
                          {money(line.qty * line.price)}
                        </span>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={line.note}
                      onChange={(event) => setNote(line.key, event.target.value)}
                      placeholder="Note (e.g. no chilli)"
                      className="mt-2.5 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted/60 focus:border-accent/50 focus:outline-none"
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Order type
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ORDER_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setDetails({ orderType: type })
                        }
                        aria-pressed={details.orderType === type}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent-bright ${
                          details.orderType === type
                            ? "border-accent bg-accent/15 text-foreground"
                            : "border-border text-muted hover:text-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-name"
                    className="text-xs uppercase tracking-[0.2em] text-muted"
                  >
                    Name (optional)
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={details.name}
                    onChange={(event) =>
                      setDetails({ name: event.target.value })
                    }
                    placeholder="Your name"
                    className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-accent/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <footer className="border-t border-border px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted">
                  {count} {count === 1 ? "item" : "items"}
                </span>
                <span className="font-display text-2xl text-accent-bright tabular-nums">
                  <span className="mr-1 text-sm text-muted">RM</span>
                  {money(total)}
                </span>
              </div>
              <p className="mt-1 text-[0.7rem] text-muted/70">
                Prices exclude 6% SST. Sending opens WhatsApp with your order
                written out — you still press send there.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearOrder}
                  className="rounded-full border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-bright"
                >
                  Clear
                </button>
                <a
                  href={whatsappHref ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-menu-green px-6 py-3 text-sm font-medium text-menu-cream transition-colors hover:bg-menu-green-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-menu-green"
                >
                  <WhatsAppIcon size={17} />
                  Send on WhatsApp
                </a>
              </div>
            </footer>
          </div>
        </div>
      ) : null}

      {/* Sticky summary bar. Kept mounted so it can slide away when emptied. */}
      <div
        ref={bar}
        className="fixed inset-x-0 bottom-0 z-40 translate-y-[120px] px-4 pb-4 opacity-0"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={!hasOrder}
          className="mx-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-full border border-accent/40 bg-surface/95 py-3 pl-6 pr-3 backdrop-blur-md transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright"
        >
          <span className="text-sm text-foreground">
            {count} {count === 1 ? "item" : "items"}
            <span className="mx-2 text-muted">·</span>
            <span className="font-semibold tabular-nums text-accent-bright">
              RM {money(total)}
            </span>
          </span>
          <span className="rounded-full bg-menu-green px-5 py-2 text-sm font-medium text-menu-cream">
            Review order
          </span>
        </button>
      </div>
    </>
  );
}
