import { MapPin, Phone, Mail, UtensilsCrossed } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  YouTubeIcon,
  WhatsAppIcon,
} from "@/components/BrandIcons";

export const site = {
  name: "Lazeez Bistro",
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
    label: "Facebook",
    handle: "Lazeez Bistro",
    href: "https://facebook.com/lazeezbistro",
    icon: FacebookIcon,
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
    href: "https://wa.me/10000000000",
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
    href: "https://maps.google.com/?q=Lazeez+Bistro",
    icon: MapPin,
  },
  {
    label: "Call Us",
    handle: "+1 (000) 000-0000",
    href: "tel:+10000000000",
    icon: Phone,
  },
  {
    label: "Email",
    handle: "info.lazeezbistro@gmail.com",
    href: "mailto:info.lazeezbistro@gmail.com",
    icon: Mail,
  },
];
