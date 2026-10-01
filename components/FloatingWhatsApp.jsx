"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { whatsappNumber } from "@/lib/site";
import { useOrder } from "@/lib/orderStore";

/**
 * A chat button that waits in the corner once the hero — which has its own
 * WhatsApp button — has scrolled away. It steps aside while there's an order
 * in progress, because the order bar takes the foot of the screen then and
 * already ends in WhatsApp.
 */
export default function FloatingWhatsApp() {
  const [past, setPast] = useState(false);
  const { count } = useOrder();

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shown = past && count === 0;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={`group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 rounded-full border border-accent/60 bg-primary pl-4 pr-4 text-primary-foreground shadow-[0_18px_40px_-14px_rgba(15,61,36,0.6)] transition-all duration-500 hover:gap-2.5 hover:bg-primary-hover hover:pr-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-bright sm:bottom-7 sm:right-7 ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.4s] motion-reduce:hidden" />
      <WhatsAppIcon size={24} className="relative shrink-0" />
      {/* The label slides out on hover. */}
      <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-500 group-hover:max-w-40 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
