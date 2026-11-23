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
 * Water photo used in the hero and the investment logic band (Bondi, Sydney),
 * made from Branding/Tony's photo of Aus Water.jpg. Shown without a credit.
 */
export const BANNER_PHOTO = "/brand/bondi-water.webp";

/** Home page intro: heading on the left, statement on the right. */
export const INTRO_TITLE = "A personal track record.";
export const STATEMENT =
  "Every figure on this page is pulled live from my Polymarket wallet and refreshed every fifteen minutes. No open positions are shown.";

/** Investment logic page intro. */
export const LOGIC_INTRO =
  "Open a section to read more. These notes are in my own words and change as my process evolves.";

export const DISCLAIMER =
  "A personal track record, shared privately. Past results don’t predict future ones, and nothing here is financial advice.";
