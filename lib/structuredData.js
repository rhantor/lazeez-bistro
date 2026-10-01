import { site, visit, socialLinks, whatsappNumber } from "@/lib/site";

/*
 * The restaurant described for search engines (schema.org/Restaurant),
 * rendered as JSON-LD on the home page. Built only from facts already in
 * lib/site.js, so it can't drift from what the page says.
 *
 * Opening hours are left out until lib/site.js has confirmed ones; wrong
 * hours in search results are worse than none.
 */
const SOCIAL = ["Instagram", "TikTok", "YouTube"];

export function restaurantJsonLd() {
  const [street, ...rest] = visit.addressLines.map((line) => line.text);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description: site.description,
    url: site.url,
    logo: `${site.url}/logo-primary.svg`,
    image: `${site.url}/opengraph-image.png`,
    telephone: `+${whatsappNumber}`,
    email: socialLinks.find((link) => link.label === "Email")?.href.replace("mailto:", ""),
    servesCuisine: site.cuisines,
    menu: `${site.url}/menu`,
    hasMap: visit.mapUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: [street, rest[0]].filter(Boolean).join(", "),
      addressLocality: "Kuala Lumpur",
      postalCode: "50480",
      addressCountry: "MY",
    },
    sameAs: socialLinks
      .filter((link) => SOCIAL.includes(link.label))
      .map((link) => link.href),
  };
}

/** Serialised for a <script> tag, with `<` escaped so no string can close it. */
export const jsonLdScript = (data) =>
  JSON.stringify(data).replace(/</g, "\u003c");
