import HomeHeader from "@/components/HomeHeader";
import HomeHero from "@/components/HomeHero";
import CuisineRibbon from "@/components/CuisineRibbon";
import SignatureDishes from "@/components/SignatureDishes";
import StorySection from "@/components/StorySection";
import VisitSection from "@/components/VisitSection";
import HomeFooter from "@/components/HomeFooter";
import InteriorPreview from "@/components/InteriorPreview";

// The interior renders are Aaron Designs artwork. public/interior/ is still
// gitignored, so the JPEGs render locally but do NOT ship to Vercel - the
// section will come up empty on the deployed site until that ignore rule is
// dropped and the files are committed, which is also the point at which
// permission to publish them needs to be confirmed.
const SHOW_INTERIOR = true;

export default function Home() {
  return (
    <>
      <HomeHeader />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <CuisineRibbon />
        <SignatureDishes />
        <StorySection />
        {SHOW_INTERIOR ? <InteriorPreview /> : null}
        <VisitSection />
      </main>
      <HomeFooter />
    </>
  );
}
