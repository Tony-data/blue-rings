import { cents, shortDate, signedMoney } from "@/lib/format";
import type { Win } from "@/lib/types";

/** Right-hand list in the "Recent wins" section: date | position, market, profit. */
export function RecentWins({ wins, error }: { wins: Win[]; error: string | null }) {
  if (error) {
    return (
      <div className="border-y border-line-strong py-8">
        <p className="text-ink">Closed positions couldn&rsquo;t be loaded from Polymarket just now. They&rsquo;ll reappear on the next refresh.</p>
        <p className="mt-3 font-mono text-xs break-words text-muted">Details: {error}</p>
      </div>
    );
  }
  if (wins.length === 0) {
    return <p className="border-b border-line-strong py-8 text-slate">No closed wins yet.</p>;
  }

  return (
    <ol>
      {wins.map((w, i) => (
        <li
          key={w.id}
          data-reveal="up"
          style={{ "--reveal-delay": `${Math.min(i, 6) * 60}ms` } as React.CSSProperties}
          className="group grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-8 border-b border-line-strong py-7 first:pt-0"
        >
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-ink-2">{w.closedAt ? shortDate(w.closedAt) : "—"}</span>
              {(w.outcome || w.avgPrice !== null) && (
                <span className="border-l border-ink-2/50 pl-3 text-muted">
                  {w.outcome ? `Backed ${w.outcome}` : "Entry"}
                  {w.avgPrice !== null && <> at {cents(w.avgPrice)}</>}
                </span>
              )}
            </p>
            <p className="mt-3 text-[1.2rem] leading-snug text-ink transition-colors duration-300 group-hover:text-blue sm:text-[1.35rem]">
              {w.title}
            </p>
          </div>
          <p className="display text-right text-[1.9rem] leading-none text-blue sm:text-[2.2rem]">{signedMoney(w.profit)}</p>
        </li>
      ))}
    </ol>
  );
}

/** Left-hand "biggest win" callout. */
export function BiggestWin({ win }: { win: Win | null }) {
  if (!win) return null;
  return (
    <div className="border-t-2 border-blue pt-6">
      <p className="eyebrow text-muted">Biggest win</p>
      <p className="display mt-3 text-[clamp(2.6rem,4.5vw,3.75rem)] leading-none text-blue">{signedMoney(win.profit)}</p>
      <p className="mt-4 text-base leading-relaxed text-ink-2">{win.title}</p>
    </div>
  );
}
