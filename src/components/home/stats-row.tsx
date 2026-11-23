import { CountUp, type CountFormat } from "@/components/count-up";
import { number } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

type Ok = Extract<Portfolio, { status: "ok" }>;
type Stat = { label: string; value: number; kind: CountFormat; tone: string };

/** Four figures in a row, each opened by a thin vertical rule; they count up on first view. */
export function StatsRow({ data }: { data: Ok }) {
  const stats: Stat[] = [];
  if (data.profit30d !== null) {
    stats.push({
      label: "Profit in the last 30 days",
      value: data.profit30d,
      kind: "signedMoney",
      tone: data.profit30d < 0 ? "text-slate" : "text-blue",
    });
  }
  if (data.winRate !== null) {
    stats.push({ label: `Win rate across ${number(data.marketsClosed)} closed markets`, value: data.winRate, kind: "percent", tone: "text-blue" });
  }
  if (data.tradeCount !== null) stats.push({ label: "Trades placed", value: data.tradeCount, kind: "number", tone: "text-blue" });
  if (data.volumeUsd !== null) stats.push({ label: "Volume traded", value: data.volumeUsd, kind: "compactMoney", tone: "text-blue" });
  if (!stats.length) return null;

  return (
    <section aria-label="Key figures" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
      <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-reveal="up"
            style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            className="flex min-h-44 flex-col border-l border-line-strong pr-4 pl-5 sm:min-h-56 sm:pl-7"
          >
            <dt className="order-2 mt-5 max-w-[16rem] text-[0.95rem] leading-snug text-ink-2 sm:text-base">{s.label}</dt>
            <dd className={`display order-1 text-[clamp(2.4rem,4.8vw,4.5rem)] leading-none ${s.tone}`}>
              <CountUp value={s.value} kind={s.kind} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
