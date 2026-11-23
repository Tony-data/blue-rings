/**
 * Site-wide copy and links. Edit the placeholders here.
 */

export const NAV = [
  { href: "/#performance", label: "Performance" },
  { href: "/#wins", label: "Recent wins" },
  { href: "/investment-logic", label: "Investment logic" },
] as const;

/** Contact details shown in the footer. Placeholders: replace with your own. */
export const CONTACT = {
  email: "you@example.com",
  location: "City, Country",
  links: [
    { label: "LinkedIn", href: "#" },
    { label: "X / Twitter", href: "#" },
  ],
};

/** The statement over the banner on the home page. */
export const STATEMENT =
  "A personal track record on Polymarket. Every figure on this page is pulled live from my wallet and refreshed every fifteen minutes.";

export const DISCLAIMER =
  "A personal track record, shared privately. Past results don’t predict future ones, and nothing here is financial advice.";
