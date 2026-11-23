# Blue Rings

A private website for my Polymarket portfolio: all-time profit, profit over time, recent wins and my strategy.
Open positions are never fetched or shown.

## How it works

- **Data:** pulled on the server from Polymarket's public Data API (v2) for the wallet in `src/lib/portfolio.ts`.
  Cached and refreshed at most every 15 minutes. Visitors' browsers never contact Polymarket.
- **Privacy:** every page sits behind a password screen (`src/proxy.ts`). Search engines are told not to index it.
- **Strategy text:** edit [`content/strategy.md`](content/strategy.md). It's plain Markdown.
- **Brand assets:** originals in `Branding/`. The web-ready versions are in `public/brand/`.

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
