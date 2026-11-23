import { cents, shortDate, signedMoney } from "@/lib/format";
import type { Win } from "@/lib/types";

export function RecentWins({ wins, best, error }: { wins: Win[]; best: Win | null; error: string | null }) {
  if (error) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-ink">Closed positions couldn&rsquo;t be loaded from Polymarket just now. They&rsquo;ll reappear on the next refresh.</p>
        <p className="mt-3 font-mono text-xs break-words text-muted">Details: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {best && (
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-line bg-surface px-5 py-4">
          <span className="eyebrow text-muted">Biggest win</span>
          <span className="text-lg font-semibold text-blue">{signedMoney(best.profit)}</span>
          <span className="min-w-0 truncate text-sm text-slate">{best.title}</span>
        </div>
      )}

      {wins.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-6 text-slate">No closed wins yet.</p>
      ) : (
        <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {wins.map((w) => {
            return (
              <li key={w.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[7.5rem_1fr_auto] sm:px-6">
                <span className="eyebrow order-3 col-span-2 text-muted sm:order-none sm:col-span-1">
                  {w.closedAt ? shortDate(w.closedAt) : "—"}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-ink">{w.title}</p>
                  {(w.outcome || w.avgPrice !== null) && (
                    <p className="mt-0.5 text-sm text-slate">
                      {w.outcome ? <>Backed <span className="text-ink-2">{w.outcome}</span></> : "Entry"}
                      {w.avgPrice !== null && <> at {cents(w.avgPrice)}</>}
                    </p>
                  )}
                </div>
                <p className="text-right text-lg font-semibold text-blue tabular">{signedMoney(w.profit)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
