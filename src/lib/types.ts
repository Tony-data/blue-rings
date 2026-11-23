/** One point on the profit-over-time chart. */
export type PnlPoint = {
  /** Epoch milliseconds (start of day, UTC). */
  t: number;
  /** Cumulative all-in profit in USD at that time. */
  v: number;
};

/** A closed position that made money. */
export type Win = {
  id: string;
  title: string;
  outcome: string | null;
  /** Average entry price, 0–1 (shown as cents). */
  avgPrice: number | null;
  /** Realised profit in USD. */
  profit: number;
  /** When the position was closed (epoch ms). */
  closedAt: number | null;
};

export type Portfolio =
  | {
      status: "ok";
      source: "live" | "sample";
      fetchedAt: number;
      totalProfit: number;
      startedAt: number | null;
      series: PnlPoint[];
      profit30d: number | null;
      /** Set when closed positions couldn't be loaded (profit still shows). */
      winsError: string | null;
      winRate: number | null;
      marketsClosed: number;
      volumeUsd: number | null;
      tradeCount: number | null;
      bestWin: Win | null;
      recentWins: Win[];
    }
  | {
      status: "unavailable";
      source: "live" | "sample";
      fetchedAt: number;
      message: string;
      /** Technical detail, shown small (the site is private). */
      reason: string;
    };
