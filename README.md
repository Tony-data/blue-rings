# Blue Rings

A private website for my Polymarket portfolio: all-time profit, profit over time, recent wins and my strategy.
Open positions are never fetched or shown.

## How it works

- **Data:** pulled on the server from Polymarket's public Data API (v2) for the wallet in `src/lib/portfolio.ts`.
  Cached and refreshed at most every 15 minutes. Visitors' browsers never contact Polymarket.
- **Privacy:** every page sits behind a password screen (`src/proxy.ts`). Search engines are told not to index it.
- **Investment logic page** (`/investment-logic`): edit [`content/strategy.md`](content/strategy.md). It's plain Markdown;
  each `##` heading becomes a numbered section, an entry in the page's contents list and a footer link.
- **Contact details, statement and disclaimer:** edit [`src/lib/site-config.ts`](src/lib/site-config.ts) (currently placeholders).
- **Brand assets:** originals in `Branding/`. The web-ready versions are in `public/brand/`.
- **Banner photo:** Bondi Beach, Sydney, by [Road Trip with Raj](https://unsplash.com/photos/aerial-view-of-body-of-water-Q-lzt8Uz4Eo)
  on Unsplash (free under the [Unsplash License](https://unsplash.com/license)). Swap it in `src/lib/site-config.ts`.
- **Motion:** the dash-field hero, scroll reveals, count-ups and parallax all switch off for visitors who've asked their
  device to reduce motion.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign in with the `SITE_PASSWORD` from `.env.local`.

`.env.local` sets `DATA_SOURCE=sample` because polymarket.com is blocked on my home network, so local previews show
made-up numbers with a "Sample data" banner. The deployed site uses live data.

## Settings (Vercel → Project → Settings → Environment Variables)

| Name | Needed | What it does |
|---|---|---|
| `SITE_PASSWORD` | Yes | The password for the site. Changing it signs everyone out. |
| `DATA_SOURCE` | No | Leave unset in Vercel. `sample` = made-up data. |
| `POLYMARKET_WALLET` | No | Overrides the wallet address. |

## Adding a domain later

Vercel → Project → Settings → Domains → Add, then copy the DNS records it shows into your registrar.
The `.vercel.app` address keeps working.
