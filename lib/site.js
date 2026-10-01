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
  seoTitle: "Lazeez Bistro — Arabic, Malaysian & Western Restaurant in Solaris Dutamas, KL",
  tagline: "Flavours worth the wait",
  cuisines: ["Arabic", "Malaysian", "Western"],
  description:
    "Lazeez Bistro at Solaris Dutamas, Kuala Lumpur: Arabic charcoal grills and mandi, Malaysian favourites and Western plates under one roof. Dine in, take away, or order on WhatsApp.",
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
    handle: "Build your order",
    href: "/menu",
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
  // Soft opening and grand opening are both behind us (2026-09-30): the
  // bistro is simply open.
  badge: "Now open · Solaris Dutamas",
  place: "Publika, Solaris Dutamas",
  // Set as three masked lines so the intro can reveal them one after another.
  headline: ["Flavours", "worth", "the wait"],
  blurb:
    "Arabic charcoal grills, Malaysian classics and Western plates — three kitchens under one roof in the heart of Solaris Dutamas.",
};

/*
 * The photographed dishes: studio shots from the menu shoot, cropped to the
 * food and with the backdrop pushed to white by the export script, served
 * from public/dishes/.
 */
const dishPhoto = (slug) => `/dishes/${slug}.jpg`;

/*
 * The filter tabs over the signature grid. `id` is what a dish's `category`
 * points at; "all" is handled by the grid itself.
 */
export const dishCategories = [
  { id: "all", label: "All" },
  { id: "starters", label: "Starters" },
  { id: "rice", label: "Rice & Mains" },
  { id: "grill", label: "Grill & Shawarma" },
  { id: "western", label: "Western" },
];

/*
 * Menu numbers again, so a price edited in lib/menu.js flows through here.
 * `blurb` is home-page copy and lives with the pick; `name` overrides the
 * printed name where the print leans on its section heading ("Chicken" under
 * Pizza).
 */
export const signatureDishes = [
  {
    no: 114,
    category: "rice",
    photo: dishPhoto("mandi"),
    blurb:
      "Smoked basmati under slow-cooked meat, the way it comes out of a Yemeni clay oven.",
  },
  {
    no: 127,
    category: "grill",
    photo: dishPhoto("mixed-grill"),
    blurb: "A spread of skewers straight off the charcoal, on warm bread with garlic sauce.",
  },
  {
    no: 118,
    category: "rice",
    photo: dishPhoto("tagine"),
    blurb: "Slow-braised in the clay pot with potato, carrot and green olives.",
  },
  {
    no: 111,
    category: "grill",
    photo: dishPhoto("super-shawarma"),
    blurb: "Shaved off the spit, pressed in a toasted wrap, with fries and garlic sauce.",
  },
  {
    no: 107,
    category: "starters",
    photo: dishPhoto("falafel"),
    blurb: "Fried to order, herb-green inside, with tahina on the side.",
  },
  {
    no: 106,
    category: "starters",
    photo: dishPhoto("hummus"),
    blurb: "Silky chickpea and tahina, finished with olive oil — plain or topped with meat.",
  },
  {
    no: 117,
    category: "rice",
    photo: dishPhoto("lamb-shank"),
    blurb: "A whole shank cooked down in its own sauce until it leaves the bone.",
  },
  {
    no: 116,
    category: "rice",
    photo: dishPhoto("biryani"),
    blurb: "Fragrant spiced rice under tender meat, with two house sauces on the side.",
  },
  {
    no: 212,
    name: "Chicken Pizza",
    category: "western",
    photo: dishPhoto("chicken-pizza"),
    blurb: "Loaded with chicken, peppers and tomato over a blanket of melted cheese.",
  },
  {
    no: 104,
    category: "starters",
    photo: dishPhoto("fattoush"),
    blurb: "Crisp chopped salad, a tangy dressing and shards of toasted bread.",
  },
  {
    no: 128,
    category: "grill",
    photo: dishPhoto("grilled-fish"),
    blurb: "Whole fish, spiced and charred over the grill, with rice or bread.",
  },
  {
    no: 219,
    category: "western",
    photo: dishPhoto("grilled-salmon"),
    blurb: "Seared fillet with buttery mash and grilled vegetables.",
  },
];

/*
 * The three kitchens. `pageId` is the matching page in lib/menu.js, which the
 * section counts and lists dishes from; `picks` are the menu numbers shown on
 * that kitchen's card, in order (or `{ no, name }` to rename one the print
 * names by its section, like "Chicken" under Pizza).
 */
export const kitchens = [
  {
    id: "arabic",
    pageId: "arabic",
    title: "Arabic",
    arabic: "عربي",
    line: "Mandi, kabsa and mixed grills from a charcoal kitchen — the heart of the menu.",
    picks: [114, 115, 127, 122, 106, 110],
  },
  {
    id: "malaysian",
    pageId: "malaysian-local-favourites",
    title: "Malaysian",
    arabic: "ماليزي",
    line: "Nasi lemak, laksa and kampung-style fried rice, cooked the way you already know them.",
    picks: [301, 302, 304, 305, 308, 311],
  },
  {
    id: "western",
    pageId: "italian-and-western-cuisine",
    title: "Western",
    arabic: "غربي",
    line: "Steaks, pastas and stone-baked pizza for the table that can never agree.",
    picks: [217, 219, 208, 209, { no: 212, name: "Chicken Pizza" }, 221],
  },
];

/* The kitchen photo wall. `wide` tiles are 4:3, the rest 3:4 (the drinks). */
export const galleryRows = [
  [
    { src: "/dishes/gallery/grilled-chicken.jpg", alt: "Charcoal grilled chicken with fries and garlic sauce", wide: true },
    { src: "/dishes/gallery/watermelon-juice.jpg", alt: "Fresh watermelon juice" },
    { src: "/dishes/gallery/samboosa.jpg", alt: "Golden samboosa on a patterned plate", wide: true },
    { src: "/dishes/gallery/turkish-coffee.jpg", alt: "Turkish coffee served in a copper pot", wide: true },
    { src: "/dishes/gallery/tabouleh.jpg", alt: "Tabouleh with lemon and tomato", wide: true },
    { src: "/dishes/gallery/mango-lassi.jpg", alt: "Mango lassi" },
    { src: "/dishes/gallery/fried-prawns.jpg", alt: "Crumbed fried prawns with fries", wide: true },
  ],
  [
    { src: "/dishes/gallery/moroccan-tea.jpg", alt: "Moroccan green tea and black Arabic tea with a silver pot", wide: true },
    { src: "/dishes/gallery/shawarma-wrap.jpg", alt: "Shawarma wraps with fries", wide: true },
    { src: "/dishes/gallery/tikka-kebab.jpg", alt: "Tikka kebab skewers on bread", wide: true },
    { src: "/dishes/gallery/lamb-pizza.jpg", alt: "Lamb pizza on a wooden board", wide: true },
    { src: "/dishes/gallery/cappuccino.jpg", alt: "Cappuccino with coffee beans", wide: true },
    { src: "/dishes/gallery/hummus-chicken.jpg", alt: "Hummus topped with chicken", wide: true },
    { src: "/dishes/gallery/lentil-soup.jpg", alt: "Lentil soup with crispy bread", wide: true },
  ],
];

/*
 * The Visit section.
 *
 * `hours` is empty until the opening hours are confirmed; while it is, the
 * section tells visitors to call or WhatsApp for today's hours rather than
 * showing a placeholder. Add rows as { days: "Monday — Thursday",
 * time: "11am — 11pm" } and the card lists them instead.
 */
export const visit = {
  venue: "Solaris Dutamas",
  // From the grand-opening flyer (social-media/discussion/decisions.md).
  addressLines: [
    { text: "A1-G2-3A, Solaris Dutamas" },
    { text: "1 Jalan Solaris Dutamas" },
    { text: "50480 Kuala Lumpur, Malaysia" },
  ],
  // What the embedded map searches for.
  mapQuery: "Lazeez Bistro, Solaris Dutamas, 50480 Kuala Lumpur",
  hours: [],
  mapUrl: "https://maps.app.goo.gl/8ZbBctYu2ENaM9W57",
  mapLabel: "Open in Google Maps",
  // The restaurant's Google Business profile: write a review, and read them.
  reviewUrl: "https://g.page/r/Cbky-ziHWvdTEAI/review",
};
