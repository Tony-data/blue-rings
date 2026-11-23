/**
 * Site-wide copy and links. Edit the placeholders here.
 */

export const NAV = [
  { href: "/#performance", label: "Performance" },
  { href: "/#wins", label: "Recent wins" },
  { href: "/investment-logic", label: "Investment logic" },
] as const;

/** Contact details shown in the footer. Email and LinkedIn are still placeholders. */
export const CONTACT = {
  email: "you@example.com",
  location: "Sydney, Australia",
  links: [
    { label: "X / Twitter", href: "https://x.com/EdgePunta" },
    { label: "LinkedIn", href: "#" },
  ],
};

/**
 * Photo behind the statement card. Free under the Unsplash License
 * (https://unsplash.com/license); credit is appreciated, not required.
 */
export const BANNER_PHOTO = {
  src: "/brand/bondi-water.webp",
  caption: "Bondi Beach, Sydney",
  credit: "Road Trip with Raj / Unsplash",
  creditUrl: "https://unsplash.com/photos/aerial-view-of-body-of-water-Q-lzt8Uz4Eo",
};

/** The statement over the banner on the home page. */
export const STATEMENT =
  "A personal track record on Polymarket. Every figure on this page is pulled live from my wallet and refreshed every fifteen minutes.";

export const DISCLAIMER =
  "A personal track record, shared privately. Past results don’t predict future ones, and nothing here is financial advice.";
