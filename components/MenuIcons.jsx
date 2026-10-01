import { useId } from "react";

/*
 * The gold section icons from the printed menu — the mosque over Arabic, the
 * hibiscus over Malaysian, the cloche over Western — redrawn from the shapes
 * in social-media/design/posts/menu_style.py.
 *
 * They fill with currentColor, and the details the print knocks out in panel
 * cream (doorways, veins, the cloche's highlight) are cut with an SVG mask
 * instead, so the icons sit on any ground.
 */

function Knockout({ viewBox, className, children, cut }) {
  const id = useId();
  return (
    <svg viewBox={viewBox} aria-hidden="true" className={className}>
      <defs>
        {/* An explicit region: the default (-10%…120% of the viewport)
            would crop the icons drawn round the origin to one quadrant. */}
        <mask
          id={id}
          maskUnits="userSpaceOnUse"
          x="-200"
          y="-200"
          width="400"
          height="400"
        >
          <rect x="-200" y="-200" width="400" height="400" fill="#fff" />
          <g fill="#000" stroke="#000">
            {cut}
          </g>
        </mask>
      </defs>
      <g fill="currentColor" mask={`url(#${id})`}>
        {children}
      </g>
    </svg>
  );
}

export function MosqueIcon({ className = "" }) {
  return (
    <Knockout
      viewBox="0 0 140 134"
      className={className}
      cut={
        <>
          <path d="M60 126V102C60 92 70 88 70 84C70 88 80 92 80 102V126Z" />
          <path d="M44 108V94C44 89 49 86 49 84C49 86 54 89 54 94V108Z" />
          <path d="M86 108V94C86 89 91 86 91 84C91 86 96 89 96 94V108Z" />
        </>
      }
    >
      <path d="M70 2a8 8 0 1 0 6 13a6 6 0 1 1-6-13z" />
      <rect x="69" y="14" width="2" height="9" />
      <path d="M40 62C40 38 58 26 70 22C82 26 100 38 100 62Z" />
      <rect x="36" y="62" width="68" height="64" />
      <path d="M12 50C12 40 21 35 21 28C21 35 30 40 30 50Z" />
      <rect x="14" y="50" width="14" height="76" />
      <rect x="10" y="72" width="22" height="5" />
      <path d="M110 50C110 40 119 35 119 28C119 35 128 40 128 50Z" />
      <rect x="112" y="50" width="14" height="76" />
      <rect x="108" y="72" width="22" height="5" />
      <rect x="4" y="126" width="132" height="6" rx="1" />
    </Knockout>
  );
}

const PETALS = [0, 72, 144, 216, 288];
const VEINS = [36, 108, 180, 252, 324];

export function HibiscusIcon({ className = "" }) {
  return (
    <Knockout
      viewBox="-70 -70 140 140"
      className={className}
      cut={
        <>
          {VEINS.map((a) => (
            <path
              key={a}
              transform={`rotate(${a})`}
              d="M0 -10L0 -44"
              strokeWidth="2"
              fill="none"
            />
          ))}
          <circle r="7" />
        </>
      }
    >
      {PETALS.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 -6C-20 -14 -26 -44 -12 -58C-6 -64 6 -64 12 -58C26 -44 20 -14 0 -6Z"
        />
      ))}
      <path
        d="M0 0C10 -18 22 -30 34 -44"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="30" cy="-50" r="4" />
      <circle cx="38" cy="-46" r="4" />
      <circle cx="40" cy="-38" r="3.5" />
    </Knockout>
  );
}

export function ClocheIcon({ className = "" }) {
  return (
    <Knockout
      viewBox="-70 -56 140 90"
      className={className}
      cut={
        <path
          d="M-38 4C-36 -10 -24 -20 -10 -24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />
      }
    >
      <circle cy="-44" r="7" />
      <rect x="-3" y="-40" width="6" height="8" />
      <path d="M-56 18C-56 -14 -30 -34 0 -34C30 -34 56 -14 56 18Z" />
      <rect x="-66" y="20" width="132" height="8" rx="4" />
    </Knockout>
  );
}
