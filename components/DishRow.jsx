"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useOrder, addLine } from "@/lib/orderStore";

const money = (value) => value.toFixed(2);

/** A count badge shown on a pill once that line is in the order. */
function Count({ value }) {
  if (!value) return null;
  return (
    <span className="ml-0.5 inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-menu-green px-1 text-[0.65rem] font-bold text-menu-cream">
      {value}
    </span>
  );
}

function AddToCartButton({ onClick, qty, label, price, ariaLabel }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    onClick(e);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 active:scale-90 ${
        qty
          ? "border-accent bg-accent text-foreground font-semibold shadow-[0_0_15px_rgba(201,162,74,0.25)]"
          : "border-accent/30 bg-background/5 text-background/90 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-[0_4px_12px_rgba(201,162,74,0.15)]"
      }`}
    >
      {/* Animated Cart Icon */}
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <span 
          className={`absolute transition-all duration-400 ${
            isAnimating ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-45'
          }`}
        >
          <Check size={16} strokeWidth={3} />
        </span>
        <span 
          className={`absolute transition-all duration-400 ${
            isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100 group-hover:-translate-y-0.5 group-hover:rotate-6'
          }`}
        >
          <ShoppingBag size={15} strokeWidth={2} />
        </span>
      </span>

      {label && <span>{label}</span>}
      {price && (
        <span className={`tabular-nums ${qty ? 'text-foreground' : 'text-accent'}`}>
          {price}
        </span>
      )}
      
      <Count value={qty} />
    </button>
  );
}

export default function DishRow({ item }) {
  const { qtyOf } = useOrder();

  const hasVariants = Boolean(item.variants);
  const plainQty = hasVariants ? 0 : qtyOf(item, null);

  return (
    <li className="js-row gsap-hidden scene-3d mt-3">
      <div
        className="group/row relative overflow-hidden rounded-2xl border border-accent/20 bg-foreground px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-[#124228] hover:shadow-[0_8px_30px_rgba(201,162,74,0.25)]"
      >
        {/* Background Pattern */}
        <div className="menu-lattice pointer-events-none absolute inset-0 opacity-5 transition-opacity duration-300 group-hover/row:opacity-10" />
        
        <div className="relative z-10 depth flex items-start gap-4" style={{ "--z": "18px" }}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={200}
            height={200}
            sizes="56px"
            className="h-14 w-14 shrink-0 rounded-full border border-accent/40 object-cover"
          />
        ) : (
          <span className="mt-1 w-8 shrink-0 text-xs tabular-nums text-background/50">
            {item.no}
          </span>
        )}

        <div className="preserve-3d min-w-0 flex-1">
          <div className="depth preserve-3d flex items-baseline justify-between gap-4" style={{ "--z": "22px" }}>
            <h4 className="font-display text-lg leading-snug text-background sm:text-xl">
              {item.name}
            </h4>

            {!hasVariants ? (
              <span
                className="depth shrink-0 font-display text-lg text-accent tabular-nums"
                style={{ "--z": "20px" }}
              >
                <span className="mr-1 text-[0.62em] tracking-wider text-accent/80">
                  RM
                </span>
                {money(item.price)}
              </span>
            ) : null}
          </div>

          {/* The braced aside the print sets after a dish name, e.g. the
              {Rice/Bread} that comes with every grill. */}
          {item.note ? (
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-background/60">
              {item.note}
            </p>
          ) : null}

          {/* One pill per variant, each adding its own line. A dish with a
              single price gets one Add button instead. Lifted highest of the
              row's layers, so the buttons lead the parallax on a tilt. */}
          <div
            className="depth mt-3 flex flex-wrap gap-2"
            style={{ "--z": "38px" }}
          >
            {hasVariants ? (
              item.variants.map((variant) => {
                const qty = qtyOf(item, variant);
                return (
                  <AddToCartButton
                    key={variant.label}
                    onClick={() => addLine(item, variant)}
                    qty={qty}
                    label={variant.label}
                    price={money(variant.price)}
                    ariaLabel={`Add ${item.name}, ${variant.label}, RM ${money(variant.price)}`}
                  />
                );
              })
            ) : (
              <AddToCartButton
                onClick={() => addLine(item, null)}
                qty={plainQty}
                ariaLabel={`Add ${item.name}, RM ${money(item.price)}`}
              />
            )}
          </div>
        </div>
        </div>

        {/* Bottom separator is no longer needed since it's now a distinct card */}
      </div>
    </li>
  );
}
