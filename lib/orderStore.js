"use client";

import { useMemo, useSyncExternalStore } from "react";
import { whatsappNumber } from "@/lib/site";

/*
 * The customer's order lives in a plain module store rather than React state.
 *
 * It has to survive a reload, which means localStorage — an external system.
 * Restoring that inside an effect would mean calling setState from the effect
 * body on every mount (a cascading render, and what react-hooks/set-state-in-
 * effect warns about), so the store owns the storage and components subscribe
 * to it through useSyncExternalStore instead.
 */

// Bumped with the s-03 print: item numbers moved under it (304 was Nasi Goreng
// Cina, and is Nasi Goreng Kampung now), so a cart saved against the old
// numbering would send the kitchen a dish that no longer exists.
const STORAGE_KEY = "lazeez-order-v2";

/** Stable reference for the server render, which has no storage to read. */
const EMPTY = Object.freeze({
  lines: [],
  details: Object.freeze({ orderType: "Dine-in", name: "" }),
});

let state = EMPTY;
let hydrated = false;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private windows and blocked site data throw on access. Losing a saved
    // order is a far smaller problem than crashing the menu.
  }
}

function hydrate() {
  hydrated = true;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    state = {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      details: { ...EMPTY.details, ...(parsed.details ?? {}) },
    };
    emit();
  } catch {
    // Unreadable or malformed storage: carry on with an empty order.
  }
}

function setState(next) {
  state = next;
  persist();
  emit();
}

function subscribe(listener) {
  // The first subscriber triggers the read, so it happens on the client only
  // and after hydration has matched the server's empty render.
  if (!hydrated) hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

/** A dish plus a chosen variant is one line; the same dish in two variants is two. */
export const lineKey = (item, variant) =>
  variant ? `${item.no}:${variant.label}` : `${item.no}`;

export function addLine(item, variant) {
  const key = lineKey(item, variant);
  const existing = state.lines.find((line) => line.key === key);

  const lines = existing
    ? state.lines.map((line) =>
        line.key === key ? { ...line, qty: line.qty + 1 } : line,
      )
    : [
        ...state.lines,
        {
          key,
          no: item.no,
          name: item.name,
          variant: variant?.label ?? null,
          price: variant ? variant.price : item.price,
          qty: 1,
          note: "",
        },
      ];

  setState({ ...state, lines });
}

export function setQty(key, qty) {
  setState({
    ...state,
    lines:
      qty <= 0
        ? state.lines.filter((line) => line.key !== key)
        : state.lines.map((line) =>
            line.key === key ? { ...line, qty } : line,
          ),
  });
}

export function setNote(key, note) {
  setState({
    ...state,
    lines: state.lines.map((line) =>
      line.key === key ? { ...line, note } : line,
    ),
  });
}

export function setDetails(patch) {
  setState({ ...state, details: { ...state.details, ...patch } });
}

export function clearOrder() {
  setState({ ...state, lines: [] });
}

const money = (value) => value.toFixed(2);

/**
 * The order written out for WhatsApp. Each line carries its own price so the
 * kitchen can check the total without opening the site, and a note sits under
 * the dish it belongs to rather than being collected at the end.
 */
function buildWhatsappHref(lines, details, total) {
  if (lines.length === 0) return null;

  const body = lines.map((line) => {
    const name = line.variant ? `${line.name} (${line.variant})` : line.name;
    const row = `${line.qty} x ${line.no} ${name} — RM ${money(line.qty * line.price)}`;
    return line.note.trim() ? `${row}\n    Note: ${line.note.trim()}` : row;
  });

  const message = [
    "Hi Lazeez Bistro! I would like to order:",
    "",
    ...body,
    "",
    `Total: RM ${money(total)}`,
    `Order type: ${details.orderType}`,
    details.name.trim() ? `Name: ${details.name.trim()}` : null,
  ]
    .filter((part) => part !== null)
    .join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function useOrder() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    const { lines, details } = snapshot;
    const count = lines.reduce((sum, line) => sum + line.qty, 0);
    const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

    return {
      lines,
      details,
      count,
      total,
      qtyOf: (item, variant) =>
        lines.find((line) => line.key === lineKey(item, variant))?.qty ?? 0,
      whatsappHref: buildWhatsappHref(lines, details, total),
    };
  }, [snapshot]);
}
