import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";
import CuisineRibbon from "@/components/CuisineRibbon";
import SignatureDishes from "@/components/SignatureDishes";
import KitchensSection from "@/components/KitchensSection";
import GalleryMarquee from "@/components/GalleryMarquee";
import VisitSection from "@/components/VisitSection";
import HomeFooter from "@/components/HomeFooter";
import InteriorPreview from "@/components/InteriorPreview";
import OrderBar from "@/components/OrderBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { restaurantJsonLd, jsonLdScript } from "@/lib/structuredData";

// The "Inside the bistro" renders (Aaron Designs artwork) live in
// public/interior/ and are committed, so the section ships to production.
const SHOW_INTERIOR = true;

export default function Home() {
  return (
    // The light theme's token scope: everything on the home page, fixed bars
    // included, resolves its colours from .home-light (see globals.css).
    <div className="home-light flex flex-1 flex-col bg-background text-foreground">
      {/* The restaurant, described for search engines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(restaurantJsonLd()) }}
      />
      <HomeHeader />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <CuisineRibbon />
        <SignatureDishes />
        <KitchensSection />
        {SHOW_INTERIOR ? <InteriorPreview /> : null}
        <GalleryMarquee />
        <VisitSection />
      </main>
      <HomeFooter />
      {/* The same basket /menu builds: a dish added from a card here is
          waiting there, and the bar slides up as soon as there is one. */}
      <OrderBar />
      <FloatingWhatsApp />
    </div>
  );
}
