import { useId } from "react";
import { FRAME } from "@/lib/frame";

/*
 * The printed menu's centre-panel frame (see lib/frame.js and HeroPanel) as a
 * container that holds any content and grows to fit it.
 *
 * The frame is drawn in three horizontal slices of the same SVG: the ornate
 * top cap and bottom cap keep the menu's exact proportions, and the middle —
 * where both outlines run dead straight (y 103–309 in the PDF's units) — is
 * stretched to whatever height the content needs. So the frame is never
 * squashed, however long the list inside it gets.
 */

const PAD = 24;
const VB_W = FRAME.width + PAD * 2;
const CX = FRAME.width / 2;
const CY = FRAME.height / 2;
const RING_SX = (FRAME.width + 18) / FRAME.width;
const RING_SY = (FRAME.height + 18) / FRAME.height;

/* Where the slices are cut, inside the straight run of both outlines. */
const TOP = 110;
const BOTTOM = 300;

/* The content box inside the inner panel, as percentages of the frame's
   width (CSS padding percentages resolve against width, which is exactly
   what scales the caps). The top inset lets content rise into the arch. */
const pct = (units) => `${(units / VB_W) * 100}%`;
const CONTENT_PADDING = {
  paddingTop: pct(PAD + 64),
  paddingBottom: pct(PAD + (FRAME.height - 352)),
  paddingLeft: pct(PAD + 30),
  paddingRight: pct(PAD + 30),
};

function Slice({ y0, y1, stretch = false }) {
  const id = useId().replace(/:/g, "");
  const gold = `${id}-gold`;
  const inset = `${id}-inset`;
  const lift = `${id}-lift`;
  return (
    <svg
      viewBox={`${-PAD} ${y0} ${VB_W} ${y1 - y0}`}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      // Clipped to its own band (the SVG default): each slice holds the whole
      // drawing and shows only its strip of it.
      className={`block w-full overflow-hidden ${stretch ? "min-h-0 flex-1" : "shrink-0"}`}
      style={stretch ? undefined : { aspectRatio: `${VB_W} / ${y1 - y0}` }}
    >
      <defs>
        {/* In user space, so the gradient runs continuously through all
            three slices rather than restarting in each. */}
        <linearGradient
          id={gold}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2={FRAME.width}
          y2={FRAME.height}
        >
          <stop offset="0" stopColor="#a0805c" />
          <stop offset="0.35" stopColor="#d9bd78" />
          <stop offset="0.6" stopColor="#9b8235" />
          <stop offset="1" stopColor="#c9a24a" />
        </linearGradient>
        <filter id={inset} x="-10%" y="-10%" width="120%" height="120%">
          <feFlood floodColor="#6f5b35" floodOpacity="0.3" />
          <feComposite in2="SourceAlpha" operator="out" />
          <feGaussianBlur stdDeviation="4" />
          <feOffset dy="2" />
          <feComposite in2="SourceAlpha" operator="in" result="shade" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shade" />
          </feMerge>
        </filter>
        <filter id={lift} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      <path
        d={FRAME.outer}
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="2.6"
        transform={`translate(${CX} ${CY}) scale(${RING_SX} ${RING_SY}) translate(${-CX} ${-CY})`}
      />
      <g filter={`url(#${lift})`}>
        <path d={FRAME.outer} fill="#faf6ee" filter={`url(#${inset})`} />
      </g>
      <path d={FRAME.inner} fill="#fdfaf4" filter={`url(#${inset})`} />
      <path
        d={FRAME.inner}
        fill="none"
        stroke="#c9a24a"
        strokeOpacity="0.6"
        strokeWidth="0.9"
      />
    </svg>
  );
}

export default function MoorishFrame({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col">
        <Slice y0={-PAD} y1={TOP} />
        <Slice y0={TOP} y1={BOTTOM} stretch />
        <Slice y0={BOTTOM} y1={FRAME.height + PAD} />
      </div>
      <div className="relative" style={CONTENT_PADDING}>
        {children}
      </div>
    </div>
  );
}
