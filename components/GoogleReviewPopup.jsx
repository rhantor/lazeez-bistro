"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Star, X } from "lucide-react";

export default function GoogleReviewPopup() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const popupRef = useRef(null);
  
  const { contextSafe } = useGSAP({ scope: popupRef });

  useEffect(() => {
    setIsMounted(true);
    // Show popup after 2.5 seconds to let the initial page animations finish
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (isOpen) {
      // Entrance animation
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      
      gsap.fromTo(popupRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
      );

      // Star animation for attention (runs continuously on mobile)
      gsap.to(".popup-star", {
        y: -8,
        scale: 1.15,
        rotate: 12,
        duration: 0.4,
        stagger: {
          each: 0.1,
          yoyo: true,
          repeat: -1, // Infinite repeat
          repeatDelay: 2
        },
        ease: "power2.out",
        delay: 0.8
      });
    }
  }, [isOpen]);

  const closePopup = contextSafe(() => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(popupRef.current, { 
      opacity: 0, 
      y: 20, 
      scale: 0.95, 
      duration: 0.3, 
      ease: "power2.in",
      onComplete: () => setIsOpen(false) 
    });
  });

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pb-20 sm:p-0">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closePopup}
      />
      
      {/* Popup Dialog */}
      <div 
        ref={popupRef}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2rem] border border-accent/20 bg-surface p-6 sm:p-8 text-center shadow-2xl"
      >
        {/* Background Pattern */}
        <div 
          className="menu-lattice pointer-events-none absolute inset-0 opacity-5" 
          style={{ backgroundSize: '48px 48px' }}
        />

        <button 
          onClick={closePopup}
          className="absolute right-5 top-5 rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-foreground active:bg-white/20"
          aria-label="Close"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="mx-auto mt-2 flex justify-center gap-1.5 text-accent">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="popup-star drop-shadow-md"
              fill="currentColor"
              strokeWidth={1.5}
              size={36}
            />
          ))}
        </div>
        
        <h2 className="mt-6 text-2xl font-bold text-foreground">
          Enjoyed your meal?
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Your feedback means the world to us. Please take a moment to leave a review on Google!
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href="https://g.page/r/Cbky-ziHWvdTEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closePopup}
            className="flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-4 text-[15px] font-bold text-background transition-all hover:bg-accent-bright hover:shadow-[0_0_20px_rgba(155,130,53,0.4)] active:scale-95"
          >
            Review Now
          </a>
          <button
            onClick={closePopup}
            className="flex w-full items-center justify-center rounded-2xl px-5 py-3 text-[15px] font-semibold text-muted transition-colors hover:text-foreground active:scale-95"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
