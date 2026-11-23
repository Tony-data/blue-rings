/**
 * Made-up data in the same shape as Polymarket's API, used for local
 * development (DATA_SOURCE=sample). polymarket.com is blocked on some
 * networks, so local previews can't load the real numbers. The deployed
 * site always uses live data. The page shows a "Sample data" banner
 * whenever this is in use.
 */
import type { RawPnlPoint, RawPosition } from "./polymarket";

// Small deterministic PRNG so the sample looks the same on every reload.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;

export function samplePnl(now: number): RawPnlPoint[] {
  const rand = mulberry32(7);
  const end = Math.floor(now / DAY) * DAY;
  const days = 600;
  const start = end - days * DAY;

  // Random walk, then pinned to 0 at the start and a target at the end
  // (a Brownian bridge) with an upward drift and an early drawdown.
  const walk: number[] = [0];
  for (let i = 1; i <= days; i++) walk.push(walk[i - 1] + (rand() - 0.5) * 2);
  const target = 6600;

  const points: RawPnlPoint[] = [];
  for (let i = 0; i <= days; i++) {
    const x = i / days;
    const bridge = walk[i] - x * walk[days];
    const trend = target * Math.pow(x, 1.35);
    const dip = -900 * Math.exp(-Math.pow((x - 0.12) / 0.06, 2));
    const v = Math.round((trend + dip + bridge * 38) * 100) / 100;
    points.push({
      timestamp: (start + i * DAY) / 1000,
      economic_pnl: i === 0 ? 0 : v,
      volume_usdc: Math.round(470_000 * x),
      trade_count: Math.round(1620 * x),
    });
  }
  points[points.length - 1].economic_pnl = target;
  return points;
}

const TITLES = [
  "Will the Fed cut rates at the December meeting?",
  "Will Bitcoin close the month above $100k?",
  "Will the ceasefire hold through the end of the month?",
  "Home team to win the conference final?",
  "Will the bill pass the Senate this session?",
  "Will monthly CPI come in at or below 0.2%?",
  "Will the film open above $150M domestically?",
  "Will the central bank hold rates in Q1?",
  "Will Ethereum trade above $5k by year end?",
  "Underdog to win the title fight?",
  "Will unemployment print at 4.2% or higher?",
  "Will the summit produce a joint statement?",
  "Will the company announce layoffs this quarter?",
  "Will gold close the year above $3,000?",
  "Favourite to win the Grand Slam final?",
];

export function sampleClosedPositions(now: number): RawPosition[] {
  const rand = mulberry32(42);
  const rows: RawPosition[] = [];
  let t = now - 2 * 3_600_000;
  for (let i = 0; i < 214; i++) {
    t -= Math.round((0.4 + rand() * 4.6) * DAY * 0.6);
    const win = rand() < 0.61;
    const avg = Math.round((0.12 + rand() * 0.8) * 100) / 100;
    const cost = Math.round((40 + rand() * 900) * 100) / 100;
    const pnl = win
      ? Math.round(cost * ((1 - avg) / avg) * (0.35 + rand() * 0.65) * 100) / 100
      : -Math.round(cost * (0.15 + rand() * 0.85) * 100) / 100;
    rows.push({
      condition_id: `sample-${i}`,
      title: TITLES[Math.floor(rand() * TITLES.length)],
      outcome: rand() < 0.7 ? "Yes" : "No",
      avg_price: avg,
      realized_pnl: pnl,
      total_cost_usdc: cost,
      last_event_at: Math.floor(t / 1000),
    });
  }
  return rows;
}
