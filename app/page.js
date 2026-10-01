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

// The interior renders are Aaron Designs artwork. public/interior/ is still
// gitignored, so the JPEGs render locally but do NOT ship to Vercel - the
// section will come up empty on the deployed site until that ignore rule is
// dropped and the files are committed, which is also the point at which
// permission to publish them needs to be confirmed.
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
