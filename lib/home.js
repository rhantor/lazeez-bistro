import { menuPages, findMenuItem } from "@/lib/menu";

/*
 * Helpers the landing page shares. The picks in lib/site.js are menu numbers;
 * these join them to the live menu so a price on the home page is always the
 * price on the menu.
 */

export const money = (value) => value.toFixed(2);

/**
 * Joins each pick to its menu item. A number that no longer exists (a dish
 * renumbered in the print) drops out rather than rendering a blank card.
 * `name` on a pick overrides the printed one, for items the print names by
 * their section ("Chicken" under Pizza).
 */
export function resolvePicks(picks) {
  return picks
    .map((pick) => {
      const found = findMenuItem(pick.no);
      if (!found) return null;
      const item = pick.name ? { ...found, name: pick.name } : found;
      return { ...pick, item };
    })
    .filter(Boolean);
}

/** Every priced option an item can be ordered as: its variants, or itself. */
export const optionsOf = (item) =>
  item.variants ?? [{ label: null, price: item.price }];

/*
 * Counted from the menu rather than typed in, so the numbers on the page can
 * never drift from the menu they describe.
 */
const BEVERAGE_PAGE = "beverage-and-dessert";

export function menuStats() {
  const count = (sections) =>
    sections.reduce((sum, section) => sum + section.items.length, 0);

  const drinksPage = menuPages.find((page) => page.id === BEVERAGE_PAGE);
  const dessertSections =
    drinksPage?.sections.filter((section) => section.name === "Dessert") ?? [];
  const drinkSections =
    drinksPage?.sections.filter((section) => section.name !== "Dessert") ?? [];

  return {
    dishes: count(
      menuPages
        .filter((page) => page.id !== BEVERAGE_PAGE)
        .flatMap((page) => page.sections),
    ),
    drinks: count(drinkSections),
    desserts: count(dessertSections),
  };
}

/**
 * Dishes on one menu page, counted — "29 dishes" on a kitchen tab. The side
 * dishes print on the Malaysian page but belong to every kitchen, so they
 * don't count towards it.
 */
export function pageItemCount(pageId) {
  const page = menuPages.find((entry) => entry.id === pageId);
  if (!page) return 0;
  return page.sections
    .filter((section) => section.name !== "Side Dish")
    .reduce((sum, section) => sum + section.items.length, 0);
}

/*
 * The printed menu's page titles are long ("Italian & Western Cuisine"); card
 * eyebrows want the kitchen in a word.
 */
const KITCHEN_OF_PAGE = {
  Arabic: "Arabic",
  "Italian & Western Cuisine": "Western",
  "Malaysian / Local Favourites": "Malaysian",
  "Beverage & Dessert": "Drinks & Dessert",
};

export const kitchenOf = (item) => KITCHEN_OF_PAGE[item.page] ?? item.page;

/**
 * "Arabic · Rice" over a dish name — or just "Western" where the section
 * already says it ("Western Cuisine"), rather than "Western · Western
 * Cuisine".
 */
export function eyebrowOf(item) {
  const kitchen = kitchenOf(item);
  return item.section.toLowerCase().includes(kitchen.toLowerCase())
    ? kitchen
    : `${kitchen} · ${item.section}`;
}
