/**
 * Thin client for Polymarket's public Data API (v2). No API key needed.
 * Docs: https://docs.polymarket.com/api-reference/data-api/overview
 *
 * These calls only ever run on the server (Vercel), never in a visitor's
 * browser, so the site works even where polymarket.com is blocked.
 */

const BASE = "https://data-api.polymarket.com/v2";
const TIMEOUT_MS = 15_000;

/** Raw point from GET /v2/user-pnl. Amounts are cumulative USDC; null = not covered. */
export type RawPnlPoint = {
  timestamp: number;
  economic_pnl?: number | null;
  position_pnl?: number | null;
  trade_pnl?: number | null;
  volume_usdc?: number | null;
  trade_count?: number | null;
};

/** Raw row from GET /v2/positions?status=CLOSED. Only the fields we use. */
export type RawPosition = {
  condition_id?: string;
  token_id?: string;
  title?: string;
  outcome?: string;
  avg_price?: number | null;
  realized_pnl?: number | null;
  total_pnl?: number | null;
  total_cost_usdc?: number | null;
  entry_cost_usdc?: number | null;
  last_event_at?: number | string | null;
};

type Page<T> = {
  data: T[];
  pagination?: { has_more?: boolean; next_cursor?: string | null };
};

const ATTEMPTS = 3;
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET with retries on rate limits, server errors and timeouts. */
async function getJson<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  let lastError: Error = new Error(`Polymarket ${path} failed`);
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    let retryAfterMs = 750 * attempt;
    try {
      const res = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (res.ok) return (await res.json()) as T;

      const body = (await res.text().catch(() => "")).replace(/\s+/g, " ").slice(0, 160);
      lastError = new Error(`Polymarket ${path} returned HTTP ${res.status}${body ? `: ${body}` : ""}`);
      if (!RETRYABLE.has(res.status)) break;
      const retryAfter = Number(res.headers.get("retry-after"));
      if (Number.isFinite(retryAfter) && retryAfter > 0) retryAfterMs = retryAfter * 1000;
    } catch (error) {
      const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      lastError = new Error(`Polymarket ${path} request failed (${reason})`);
    }
    if (attempt < ATTEMPTS) await sleep(Math.min(retryAfterMs, 5000));
  }
  throw lastError;
}

/** All-time cumulative profit series, one point per day, oldest first. */
export async function fetchPnlSeries(wallet: string): Promise<RawPnlPoint[]> {
  const body = await getJson<{ data: { points: RawPnlPoint[] } }>("/user-pnl", {
    user: wallet,
    interval: "max",
    fidelity: "1d",
  });
  return body.data?.points ?? [];
}

/** Every closed position, most recently closed first. */
export async function fetchClosedPositions(
  wallet: string,
  maxPages = 10,
): Promise<RawPosition[]> {
  const anchor = {
    user: wallet,
    status: "CLOSED",
    sort_by: "TIMESTAMP",
    sort_direction: "DESC",
  };
  const rows: RawPosition[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < maxPages; page++) {
    // The API wants the same anchor params on every page, plus the cursor.
    const params: Record<string, string> = cursor ? { ...anchor, cursor } : { ...anchor, limit: "500" };
    const body: Page<RawPosition> = await getJson<Page<RawPosition>>("/positions", params);
    rows.push(...(body.data ?? []));
    cursor = body.pagination?.next_cursor ?? null;
    if (!cursor) break;
  }
  return rows;
}

/** Accepts epoch seconds, epoch ms, or an ISO string. */
export function toMs(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  const n = Number(value);
  if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}
