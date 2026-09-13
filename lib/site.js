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
