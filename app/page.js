import ComingSoon from "@/components/ComingSoon";
import InteriorPreview from "@/components/InteriorPreview";

// The interior renders are Aaron Designs artwork and are not cleared for
// public release, and public/interior/ is gitignored so the JPEGs do not ship
// to Vercel. Flip this to true once permission is confirmed and the images are
// committed - nothing else needs to change.
const SHOW_INTERIOR = false;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <ComingSoon showScrollCue={SHOW_INTERIOR} />
      {SHOW_INTERIOR ? <InteriorPreview /> : null}
    </main>
  );
}
