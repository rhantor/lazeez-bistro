/*
 * Lazeez Bistro menu — transcribed from the printed menu artwork.
 *
 * Seeded from the designer's menu.json (delivered in
 * lazeez-menu-for-claude-code.zip alongside the two 300dpi page scans), then
 * brought in line with the final artwork, "Lazeez Bistro menu-s-03.pdf" — 117
 * items. Item numbers are the ones printed on the menu, so they moved where
 * the print moved them: the local favourites list grew to 301-314 and the side
 * dishes shifted to 315-318.
 *
 * Shape: pages -> sections -> items. An item has either a single `price` or a
 * list of `variants` ({ label, price }), matching how the print indents a/b/c
 * rows beneath a dish. An optional `note` carries the braced aside the print
 * sets after a dish name — {Rice/Bread}, {Hot/Iced} — shown as a caption.
 *
 * ADDING A PHOTO: give an item an `image` path, e.g.
 *
 *   { no: 114, name: "Mandi", image: "/menu/mandi.png", variants: [...] }
 *
 * and that dish's card grows a round medallion above it. Items without one
 * stay text-only, so photos can be added a few at a time. Cut-outs on a
 * transparent background suit the medallion best, matching the floating
 * cut-out photos in the printed menu; any square-ish photo also works.
 *
 * This file is now the source of truth — edit it directly. It was seeded from
 * the designer's menu.json, but re-running that seed would discard any images
 * and wording added since.
 */

export const menuMeta = {
  restaurant: "Lazeez Bistro",
  tagline: "Arabic • Malaysian • Western",
  currency: "RM",
  footnote: "All prices are subject to 6% SST. Images for illustration purposes only.",
};

export const menuPages = [
  {
    id: "arabic",
    title: "Arabic",
    sections: [
      {
        name: "Soup",
        items: [
          { no: 101, name: "Lentil Soup", variants: [{ label: "Veg", price: 10.9 }, { label: "Chicken", price: 12.9 }, { label: "Lamb", price: 15.9 }] },
          { no: 102, name: "Cream Soup", variants: [{ label: "Mushroom", price: 10.9 }, { label: "Chicken", price: 12.9 }] },
          { no: 103, name: "Lamb Soup (Kambing Soup)", price: 13.9 },
        ],
      },
      {
        name: "Salad",
        items: [
          { no: 104, name: "Fattoush", price: 12.9 },
          { no: 105, name: "Tabouleh", price: 12.9 },
        ],
      },
      {
        name: "Appetizer",
        items: [
          { no: 106, name: "Hummus", variants: [{ label: "Tahina", price: 10.9 }, { label: "Chicken", price: 12.9 }, { label: "Lamb", price: 15.9 }] },
          { no: 107, name: "Falafel", image: "/menu/falafel.png", price: 12.9 },
          { no: 108, name: "Samboosa", variants: [{ label: "Chicken", price: 12.9 }, { label: "Lamb", price: 15.9 }] },
          { no: 109, name: "Kibbeh Lamb", price: 15.9 },
        ],
      },
      {
        name: "Shawarma & Sandwich",
        items: [
          { no: 110, name: "Shawarma Sandwich Platter", variants: [{ label: "Chicken", price: 15.9 }, { label: "Beef", price: 17.9 }] },
          { no: 111, name: "Super Shawarma Plate", variants: [{ label: "Chicken", price: 17.9 }, { label: "Beef", price: 19.9 }] },
          { no: 112, name: "Shawarma Rice Bowl", variants: [{ label: "Chicken", price: 15.9 }, { label: "Beef", price: 17.9 }] },
          { no: 113, name: "Shawarma Sandwich Wrap", variants: [{ label: "Chicken", price: 9.9 }, { label: "Beef", price: 12.9 }] },
        ],
      },
      {
        name: "Rice",
        items: [
          { no: 114, name: "Mandi", image: "/menu/mandi.png", variants: [{ label: "Chicken", price: 19.9 }, { label: "Lamb", price: 25.9 }] },
          { no: 115, name: "Kabsa", variants: [{ label: "Chicken", price: 19.9 }, { label: "Lamb", price: 25.9 }] },
          { no: 116, name: "Biryani", variants: [{ label: "Chicken", price: 19.9 }, { label: "Lamb", price: 25.9 }] },
          { no: 117, name: "Lamb Shank", note: "Rice / Bread", price: 39.9 },
          { no: 118, name: "Tagine", note: "Rice / Bread", variants: [{ label: "Chicken", price: 25.9 }, { label: "Lamb", price: 29.9 }] },
          { no: 119, name: "Family Platter Chicken", variants: [{ label: "4 pax", price: 75.9 }, { label: "8 pax", price: 189.9 }] },
          { no: 120, name: "Family Platter Lamb", variants: [{ label: "4 pax", price: 99.9 }, { label: "8 pax", price: 199.9 }] },
        ],
      },
      {
        name: "Grills",
        items: [
          { no: 121, name: "Shish Tawook With Saffron", note: "Rice / Bread", price: 29.9 },
          { no: 122, name: "Shish Kebab", note: "Rice / Bread", price: 35.9 },
          { no: 123, name: "Lamb Chop", note: "Rice / Bread", price: 35.9 },
          { no: 124, name: "Grilled Chicken", note: "Rice / Bread", price: 29.9 },
          { no: 125, name: "Kebab Khashkhash", note: "Rice / Bread", price: 29.9 },
          { no: 126, name: "Tikka Kebab", note: "Rice / Bread", variants: [{ label: "Chicken", price: 25.9 }, { label: "Lamb", price: 29.9 }] },
          { no: 127, name: "Mixed Grill", note: "Rice / Bread", variants: [{ label: "Small", price: 49.9 }, { label: "Family (8 pax)", price: 115.9 }] },
          { no: 128, name: "Grilled Fish", note: "Rice / Bread", price: 35.9 },
          { no: 129, name: "Fajitas", variants: [{ label: "Chicken", price: 19.9 }, { label: "Beef", price: 25.9 }] },
        ],
      },
    ],
  },
  {
    id: "italian-and-western-cuisine",
    title: "Italian & Western Cuisine",
    sections: [
      {
        name: "Fried",
        items: [
          { no: 201, name: "Fried Prawns", price: 35.9 },
          { no: 202, name: "Fried Fish", price: 35.9 },
          { no: 203, name: "Fried Fish Fillet", price: 25.9 },
          { no: 204, name: "Chicken Nugget", price: 15.9 },
          { no: 205, name: "Fried Chicken Strips", price: 15.9 },
          { no: 206, name: "Fried Chicken", variants: [{ label: "2 Pcs", price: 15.9 }, { label: "5 Pcs", price: 35.9 }] },
        ],
      },
      {
        name: "Pasta",
        items: [
          { no: 207, name: "Alfredo", price: 21.9 },
          { no: 208, name: "Carbonara", price: 21.9 },
          { no: 209, name: "Bolognese", price: 25.9 },
          { no: 210, name: "Aglio Olio", price: 21.9 },
        ],
      },
      {
        name: "Pizza",
        items: [
          { no: 211, name: "Classic Cheese Pizza", price: 21.9 },
          { no: 212, name: "Chicken", price: 24.9 },
          { no: 213, name: "Lamb", price: 27.9 },
          { no: 214, name: "Cheese With Mushroom", price: 22.9 },
          { no: 215, name: "Pepperoni", price: 24.9 },
          { no: 216, name: "Mixed Large Pizza", price: 29.9 },
        ],
      },
      {
        name: "Western Cuisine",
        items: [
          { no: 217, name: "Beef Steak", price: 29.9 },
          { no: 218, name: "Grilled Chicken Chop", price: 25.9 },
          { no: 219, name: "Grilled Salmon", price: 39.9 },
          { no: 220, name: "Beef Breakfast Platter", price: 29.9 },
          { no: 221, name: "Fish & Chips", price: 25.9 },
        ],
      },
    ],
  },
  {
    id: "malaysian-local-favourites",
    title: "Malaysian / Local Favourites",
    inverted: true,
    sections: [
      {
        name: "Malaysian / Local Favourites",
        items: [
          { no: 301, name: "Nasi Lemak Ayam Goreng Berempah", price: 19.9 },
          { no: 302, name: "Nasi Lemak Beef Rendang", price: 25.9 },
          { no: 303, name: "Nasi Ayam Kunyit", price: 18.9 },
          { no: 304, name: "Nasi Goreng Kampung", price: 15.9 },
          { no: 305, name: "Char Kway Teow", price: 15.9 },
          { no: 306, name: "Mee Goreng Mamak", price: 15.9 },
          { no: 307, name: "Maggi Goreng Special", price: 12.9 },
          { no: 308, name: "Curry Laksa", price: 19.9 },
          { no: 309, name: "Butter Chicken (Indian Style)", price: 19.9 },
          { no: 310, name: "Masala Chicken (Indian Style)", price: 19.9 },
          { no: 311, name: "Chicken Satay (5 pcs)", price: 9.9 },
          { no: 312, name: "Beef Satay (5 pcs)", price: 13.9 },
          { no: 313, name: "Cucur Udang", price: 15.9 },
          { no: 314, name: "Cekodok Pisang", price: 13.9 },
        ],
      },
      {
        name: "Side Dish",
        items: [
          { no: 315, name: "Rice", variants: [{ label: "Mandi", price: 8.9 }, { label: "Kabsa", price: 8.9 }, { label: "Biryani", price: 8.9 }, { label: "Basmati White", price: 6.9 }] },
          { no: 316, name: "French Fries", price: 9.9 },
          { no: 317, name: "Fried Egg/Omelet", price: 4.9 },
          { no: 318, name: "Arabic Bread", variants: [{ label: "Plain", price: 2.9 }, { label: "Garlic", price: 4.9 }, { label: "Cheese", price: 5.9 }, { label: "Malawa", price: 6.9 }] },
        ],
      },
    ],
  },
  {
    id: "beverage-and-dessert",
    title: "Beverage & Dessert",
    sections: [
      {
        name: "Tea",
        items: [
          { no: 401, name: "Teh Tarik", price: 3.9 },
          { no: 402, name: "Teh Ice", price: 4.9 },
          { no: 403, name: "Teh Halia", price: 4.9 },
          { no: 404, name: "Teh O Halia", price: 3.9 },
          { no: 405, name: "Teh Ice Limau", price: 3.9 },
          { no: 406, name: "Milo Dinosaur", price: 5.9 },
          { no: 407, name: "Milo Ice", price: 5.9 },
          { no: 408, name: "Black Arabic Tea", variants: [{ label: "Cup", price: 6.9 }, { label: "Pot Small", price: 12.9 }, { label: "Pot Large", price: 17.9 }] },
          { no: 409, name: "Moroccan Green Tea", note: "Hot / Iced", variants: [{ label: "Cup", price: 6.9 }, { label: "Pot Small", price: 12.9 }, { label: "Pot Large", price: 17.9 }] },
          { no: 410, name: "Arabic Adani Tea", variants: [{ label: "Cup", price: 7.9 }, { label: "Pot Small", price: 13.9 }, { label: "Pot Large", price: 18.9 }] },
          { no: 411, name: "Saudi Karak Tea", variants: [{ label: "Cup", price: 7.9 }, { label: "Pot Small", price: 13.9 }, { label: "Pot Large", price: 18.9 }] },
        ],
      },
      {
        name: "Coffee",
        items: [
          { no: 412, name: "Kopi", price: 5.9 },
          { no: 413, name: "Kopi Ice", price: 5.9 },
          { no: 414, name: "Kopi O", price: 4.9 },
          { no: 415, name: "Kopi Cham", price: 5.9 },
          { no: 416, name: "Nescafe with Milk", variants: [{ label: "Cup", price: 7.9 }, { label: "Pot Small", price: 13.9 }, { label: "Pot Large", price: 18.9 }] },
          { no: 417, name: "Turkish Coffee", variants: [{ label: "Cup", price: 7.9 }, { label: "Pot Small", price: 13.9 }, { label: "Pot Large", price: 18.9 }] },
          { no: 418, name: "Espresso", price: 8.9 },
          { no: 419, name: "Cappuccino", price: 9.9 },
          { no: 420, name: "Latte", price: 9.9 },
        ],
      },
      {
        name: "Soft Drinks",
        items: [
          { no: 426, name: "Coke / Coke Zero / Sprite / Fanta Orange / 100plus", price: 4.9 },
        ],
      },
      {
        name: "Barbican",
        items: [
          { no: 427, name: "Apple / Lemon / Strawberry / Peach / Pineapple", price: 9.9 },
        ],
      },
      {
        name: "Cold Drinks",
        items: [
          { no: 421, name: "Syrup Bandung", price: 5.9 },
          { no: 422, name: "Limau Ice", price: 4.9 },
          { no: 423, name: "Asam Boi Limau", price: 5.9 },
          { no: 424, name: "Barley", price: 4.9 },
          { no: 425, name: "Mineral Water", variants: [{ label: "Small", price: 3.9 }, { label: "Large", price: 7.9 }] },
        ],
      },
      {
        name: "Fresh Juice",
        items: [
          { no: 428, name: "Cocktail Juice", price: 11.9 },
          { no: 429, name: "Mango Juice", price: 11.9 },
          { no: 430, name: "Watermelon Juice", price: 11.9 },
          { no: 431, name: "Pineapple Juice", price: 11.9 },
          { no: 432, name: "Orange Juice", price: 11.9 },
          { no: 433, name: "Carrot Juice", price: 11.9 },
        ],
      },
      {
        name: "Milkshake & Lassi",
        items: [
          { no: 434, name: "Banana Milkshake", price: 12.9 },
          { no: 435, name: "Chocolate Milkshake", price: 12.9 },
          { no: 436, name: "Mango Milkshake", price: 12.9 },
          { no: 437, name: "Oreo Milkshake", price: 12.9 },
          { no: 438, name: "Carrot Milkshake", price: 12.9 },
          { no: 439, name: "Lassi", variants: [{ label: "Sweet", price: 12.9 }, { label: "Salt", price: 12.9 }] },
          { no: 440, name: "Mango Lassi", price: 12.9 },
          { no: 441, name: "Banana Lassi", price: 12.9 },
        ],
      },
      {
        name: "Dessert",
        items: [
          { no: 442, name: "Kunafa", variants: [{ label: "Original", price: 9.9 }, { label: "Cream", price: 13.9 }, { label: "Cheese", price: 15.9 }] },
          { no: 443, name: "Cup Kunafa", price: 13.9 },
          { no: 444, name: "Rice Milk Pudding", price: 13.9 },
          { no: 445, name: "Crème Brûlée", price: 13.9 },
          { no: 446, name: "Mouhalabieh", price: 13.9 },
          { no: 447, name: "Baklawa 4 pcs", price: 12.9 },
          { no: 448, name: "Mix Cut Fruits", price: 19.9 },
          { no: 449, name: "Banana Split", price: 19.9 },
        ],
      },
    ],
  },
];
