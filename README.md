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
- **Banner photo:** `Branding/Tony's photo of Aus Water.jpg` (Bondi, Sydney), resized to `public/brand/bondi-water.webp`.
  The same image is on Unsplash as [Q-lzt8Uz4Eo](https://unsplash.com/photos/aerial-view-of-body-of-water-Q-lzt8Uz4Eo),
  whose licence doesn't require a credit. Swap it in `src/lib/site-config.ts`.
- **Motion:** the ring-field hero (`src/components/ring-field.tsx`), scroll reveals, count-ups and parallax all switch off
  for visitors who've asked their device to reduce motion.

## Design versions

Each design is saved as a git tag, so features can be pulled from it later
(`git show <tag>:path/to/file` or `git checkout <tag> -- path/to/file`).

| Tag | What it is |
|---|---|
| `v3-ring-hero` | **Live.** The original layout with the ring-field top and blue profit panel. |
| `v2-citadel-style` | Citadel-inspired layout: two-column section intros, figures row with hairlines, news-style recent wins, accordion investment logic, dark footer, Bondi photo with pointer ripples (`ripple-water.tsx`). Also on branch `redesign-v2`. |
| `v1-millennium-style` | The first design: dash-field hero, slash links throughout. |

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

## Domain

Live at **https://blueringspm.com** (registered at Porkbun; DNS stays at Porkbun).

| Porkbun DNS record | Value | Purpose |
|---|---|---|
| A, host blank | `216.198.79.1` | Points the domain at Vercel |
| MX ×2, TXT `v=spf1 …` | Porkbun defaults | Email forwarding (optional) |

Porkbun's URL forwarding must stay off, or it replaces the A record. Vercel issues the HTTPS certificate
automatically. `blue-rings.vercel.app` can be set to redirect to the domain under Vercel → Settings → Domains.
Logins are remembered per address, so a new address asks for the password once.
