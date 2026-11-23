import { cents, shortDate, signedMoney } from "@/lib/format";
import type { Win } from "@/lib/types";

export function RecentWins({ wins, best, error }: { wins: Win[]; best: Win | null; error: string | null }) {
  if (error) {
    return (
      <div className="border-y border-blue/25 py-8">
        <p className="text-ink">Closed positions couldn&rsquo;t be loaded from Polymarket just now. They&rsquo;ll reappear on the next refresh.</p>
        <p className="mt-3 font-mono text-xs break-words text-muted">Details: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {best && (
        <div data-reveal="up" className="grid gap-x-10 gap-y-3 border-y border-blue/25 py-8 sm:grid-cols-[auto_1fr] sm:items-end">
          <div>
            <p className="eyebrow text-muted">Biggest win</p>
            <p className="display mt-2 text-[clamp(3rem,6vw,4.75rem)] leading-none text-blue">{signedMoney(best.profit)}</p>
          </div>
          <p className="text-lg text-ink-2 sm:pb-1.5">{best.title}</p>
        </div>
      )}

      {wins.length === 0 ? (
        <p className="border-b border-line py-8 text-slate">No closed wins yet.</p>
      ) : (
        <ol className={best ? "" : "border-t border-blue/25"}>
          {wins.map((w, i) => (
            <li
              key={w.id}
              data-reveal="up"
              style={{ "--reveal-delay": `${Math.min(i, 6) * 60}ms` } as React.CSSProperties}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-line px-1 py-5 transition-colors duration-300 hover:bg-blue-mist/70 sm:grid-cols-[8rem_1fr_auto] sm:px-3"
            >
              <span className="eyebrow order-3 col-span-2 text-muted sm:order-none sm:col-span-1">
                {w.closedAt ? shortDate(w.closedAt) : "—"}
              </span>
              <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                <p className="font-medium text-ink">{w.title}</p>
                {(w.outcome || w.avgPrice !== null) && (
                  <p className="mt-0.5 text-sm text-slate">
                    {w.outcome ? (
                      <>
                        Backed <span className="text-ink-2">{w.outcome}</span>
                      </>
                    ) : (
                      "Entry"
                    )}
                    {w.avgPrice !== null && <> at {cents(w.avgPrice)}</>}
                  </p>
                )}
              </div>
              <p className="display text-right text-[2rem] leading-none text-blue">{signedMoney(w.profit)}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
