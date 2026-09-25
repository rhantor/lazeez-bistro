import { MapPin, Phone, Mail, UtensilsCrossed } from "lucide-react";
import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/components/BrandIcons";

// The bistro WhatsApp line, digits only, as wa.me links require. The menu
// order builder deep-links to this number too, so it lives in one place.
export const whatsappNumber = "601111192309";

export const site = {
  name: "Lazeez Bistro",
  seoTitle: "Lazeez Bistro ( Solaris Dutamas) Arabic, Western & Malaysian Cuisine .",
  tagline: "Flavours worth the wait",
  cuisines: ["Arabic", "Malaysian", "Western"],
  description:
    "Lazeez Bistro — Arabic, Malaysian and Western cooking. A new dining experience is on its way. Follow us for the latest updates.",
  url: "https://lazeezbistro.com",
};

// Interior renders from the Aaron Designs fit-out proposal (July 2026).
// Teaser only — the full set lives in the internal presentation.
export const interiorPreview = [
  {
    src: "/interior/dining-hall.jpg",
    alt: "Main dining hall with tiled arches, green banquettes and hanging lanterns",
    caption: "The dining hall",
    featured: true,
  },
  {
    src: "/interior/shopfront.jpg",
    alt: "Lazeez Bistro shopfront with illuminated signage and carved screen",
    caption: "Our doors at Publika",
  },
  {
    src: "/interior/feature-wall.jpg",
    alt: "Feature wall with Moorish mosaic tiling, brass lanterns and banquette seating",
    caption: "The feature wall",
  },
];

// Edit these to point at the real accounts.
export const socialLinks = [
  {
    label: "Instagram",
    handle: "@lazeezbistro",
    href: "https://instagram.com/lazeezbistro",
    icon: InstagramIcon,
  },
  {
    label: "TikTok",
    handle: "@lazeezbistro",
    href: "https://tiktok.com/@lazeezbistro",
    icon: TikTokIcon,
  },
  {
    label: "YouTube",
    handle: "Lazeez Bistro",
    href: "https://youtube.com/@lazeezbistro",
    icon: YouTubeIcon,
  },
  {
    label: "WhatsApp",
    handle: "Message us",
    href: `https://wa.me/${whatsappNumber}`,
    icon: WhatsAppIcon,
  },
  {
    label: "Order Online",
    handle: "Coming soon",
    href: "#",
    icon: UtensilsCrossed,
  },
  {
    label: "Find Us",
    handle: "View on the map",
    href: "https://maps.app.goo.gl/8ZbBctYu2ENaM9W57",
    icon: MapPin,
  },
  {
    label: "Call Us",
    handle: "+60 11-1119 2309",
    href: "tel:+601111192309",
    icon: Phone,
  },
  {
    label: "Email",
    handle: "info.lazeezbistro@gmail.com",
    href: "mailto:info.lazeezbistro@gmail.com",
    icon: Mail,
  },
];

/* ---------------------------------------------------------------------------
 * Home page content
 *
 * The landing page draws its words from here rather than hard-coding them in
 * the components, so copy can be revised without touching the animation work.
 * ------------------------------------------------------------------------- */

export const hero = {
  badge: "Now open",
  place: "Publika, Solaris Dutamas",
  // Set as three masked lines so the intro can reveal them one after another.
  headline: ["Flavours", "worth", "the wait"],
  blurb:
    "Arabic charcoal grills, Malaysian classics and Western plates — three kitchens under one roof in the heart of Publika.",
};

/*
 * Menu numbers, not names: the cards look each dish up in lib/menu.js so the
 * price shown here is the price on the menu. Change a price there and it
 * changes here. `blurb` is home-page copy and lives with the pick.
 */
export const signatureDishes = [
  {
    no: 114,
    blurb:
      "Smoked basmati under slow-cooked meat, the way it comes out of a Yemeni clay oven.",
  },
  {
    no: 107,
    blurb: "Fried to order, herb-green inside, with tahina on the side.",
  },
  {
    no: 110,
    blurb: "Shaved off the spit all day, with garlic sauce and pickles.",
  },
  {
    no: 302,
    blurb: "Coconut rice, sambal, and rendang left on the heat until it darkens.",
  },
  {
    no: 219,
    blurb: "Grilled over open flame, dressed simply, finished with lemon.",
  },
  {
    no: 442,
    blurb: "Shredded pastry over hot cheese, soaked in syrup, eaten immediately.",
  },
];

/* The three kitchens, as told on the way down the page. */
export const storyPillars = [
  {
    title: "Arabic",
    line: "Mandi, kabsa and mixed grills from a charcoal kitchen — the heart of the menu.",
  },
  {
    title: "Malaysian",
    line: "Nasi lemak, laksa and kampung-style fried rice, cooked the way you already know them.",
  },
  {
    title: "Western",
    line: "Steaks, pastas and stone-baked pizza for the table that can never agree.",
  },
];

/*
 * PLACEHOLDERS — replace before launch.
 *
 * Every entry carrying `todo: true` renders on the page in a visibly
 * unfinished style (dashed underline, muted) so an un-filled value cannot
 * quietly ship looking like a real one. Drop the flag once the text is real.
 */
export const visit = {
  venue: "Publika, Solaris Dutamas",
  addressLines: [
    { text: "Lot number — to confirm", todo: true },
    { text: "Publika, Solaris Dutamas" },
    { text: "1 Jalan Dutamas 1" },
    { text: "50480 Kuala Lumpur, Malaysia" },
  ],
  hours: [
    { days: "Monday — Thursday", time: "Opening hours — to confirm", todo: true },
    { days: "Friday — Sunday", time: "Opening hours — to confirm", todo: true },
  ],
  mapUrl: "https://maps.app.goo.gl/8ZbBctYu2ENaM9W57",
  mapLabel: "Open in Google Maps",
};
