import MenuHero from "@/components/MenuHero";
import MenuExperience from "@/components/MenuExperience";

export const metadata = {
  title: "Menu",
  description:
    "The full Lazeez Bistro menu — Arabic mezze, grills and mandi, Italian and Western plates, Malaysian favourites, and a long list of teas, juices and desserts. Build your order and send it to us on WhatsApp.",
};

export default function MenuPage() {
  return (
    <main className="menu-light relative flex flex-1 flex-col bg-background text-foreground">
      {/*
        The printed menu's gold lattice. It sits above the cream background but
        below the content, so the layers are ordered explicitly: a negative
        z-index would drop it behind the page's own background and disappear.
        Fixed rather than scrolling keeps it from banding against the rows.
      */}
      <div
        aria-hidden="true"
        className="menu-lattice pointer-events-none fixed inset-0 z-0 opacity-[0.13]"
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <MenuHero />
        <MenuExperience />
      </div>
    </main>
  );
}
