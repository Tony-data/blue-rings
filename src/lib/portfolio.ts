import { cacheLife } from "next/cache";
import {
  fetchClosedPositions,
  fetchPnlSeries,
  toMs,
  type RawPnlPoint,
  type RawPosition,
} from "./polymarket";
import { sampleClosedPositions, samplePnl } from "./sample-data";
import type { PnlPoint, Portfolio, Win } from "./types";

/** Public Polymarket proxy wallet. Can be overridden with POLYMARKET_WALLET. */
const DEFAULT_WALLET = "0xF29dbB8a92eFb21E55094F0892a0A5d28B8faDD3";

const DAY = 86_400_000;
const RECENT_WINS = 8;
/** Ignore dust wins (e.g. a few cents from redeeming leftovers). */
const MIN_WIN_USD = 1;

/**
 * Everything the home page shows, fetched on the server and cached.
 * Refreshes in the background at most every 15 minutes.
 * Open positions are never requested or shown.
 */
export async function getPortfolio(): Promise<Portfolio> {
  "use cache";

  const source = process.env.DATA_SOURCE === "sample" ? "sample" : "live";
  const wallet = process.env.POLYMARKET_WALLET || DEFAULT_WALLET;
  const now = Date.now();

  if (source === "sample") {
    cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
    return summarise(source, now, samplePnl(now), sampleClosedPositions(now), null);
  }

  const [pnl, closed] = await Promise.allSettled([
    fetchPnlSeries(wallet),
    fetchClosedPositions(wallet),
  ]);

  if (pnl.status === "fulfilled") {
    const winsError = closed.status === "rejected" ? describe(closed.reason) : null;
    if (winsError) console.error("[portfolio] closed positions failed:", winsError);
    // A partial result refreshes sooner so the wins come back quickly.
    if (winsError) cacheLife({ stale: 60, revalidate: 120, expire: 86_400 });
    else cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
    return summarise(source, now, pnl.value, closed.status === "fulfilled" ? closed.value : [], winsError);
  }

  const reason = describe(pnl.reason);
  console.error("[portfolio] profit history failed:", reason);

  // During a background refresh, throwing keeps the last good numbers on the
  // page and Next.js retries on the next visit. During the build there's no
  // previous version yet, so show a message instead of failing the deploy.
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error(reason);
  }
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  return {
    status: "unavailable",
    source,
    fetchedAt: now,
    message: "Live data from Polymarket is temporarily unavailable. Please check back shortly.",
    reason,
  };
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function summarise(
  source: "live" | "sample",
  now: number,
  points: RawPnlPoint[],
  closed: RawPosition[],
  winsError: string | null,
): Portfolio {
  // Profit = economic P&L: realised + unrealised, after fees, including rebates/rewards.
  const series: PnlPoint[] = points
    .map((p) => ({
      t: toMs(p.timestamp) ?? 0,
      v: p.economic_pnl ?? p.position_pnl ?? p.trade_pnl ?? null,
    }))
    .filter((p): p is PnlPoint => p.t > 0 && typeof p.v === "number" && Number.isFinite(p.v))
    .sort((a, b) => a.t - b.t);

  const last = series.at(-1);
  const lastRaw = points.at(-1);
  const totalProfit = last?.v ?? 0;

  // First day with any activity, so the chart doesn't start with a long flat line.
  const firstActive = series.findIndex((p) => p.v !== 0);
  const trimmed = firstActive > 1 ? series.slice(firstActive - 1) : series;

  let profit30d: number | null = null;
  if (last && trimmed.length > 1 && trimmed[0].t <= last.t - 30 * DAY) {
    const base = [...trimmed].reverse().find((p) => p.t <= last.t - 30 * DAY);
    if (base) profit30d = last.v - base.v;
  }

  const results = closed
    .map(toWin)
    .filter((w): w is Win => w !== null);
  const decided = results.filter((w) => Math.abs(w.profit) >= 0.01);
  const wins = decided.filter((w) => w.profit > 0);

  const bigEnough = wins.filter((w) => w.profit >= MIN_WIN_USD);
  const recentWins = [...bigEnough]
    .sort((a, b) => (b.closedAt ?? 0) - (a.closedAt ?? 0))
    .slice(0, RECENT_WINS);
  const bestWin = bigEnough.reduce<Win | null>(
    (best, w) => (!best || w.profit > best.profit ? w : best),
    null,
  );

  return {
    status: "ok",
    source,
    fetchedAt: now,
    totalProfit,
    startedAt: trimmed[0]?.t ?? null,
    series: trimmed,
    profit30d,
    winsError,
    winRate: decided.length ? wins.length / decided.length : null,
    marketsClosed: decided.length,
    volumeUsd: lastRaw?.volume_usdc ?? null,
    tradeCount: lastRaw?.trade_count ?? null,
    bestWin,
    recentWins,
  };
}

function toWin(row: RawPosition, index: number): Win | null {
  const profit = row.realized_pnl ?? row.total_pnl;
  if (typeof profit !== "number" || !Number.isFinite(profit)) return null;
  return {
    id: `${row.condition_id ?? "pos"}-${row.token_id ?? index}`,
    title: row.title?.trim() || "Untitled market",
    outcome: row.outcome?.trim() || null,
    avgPrice: typeof row.avg_price === "number" ? row.avg_price : null,
    profit,
    closedAt: toMs(row.last_event_at),
  };
}
