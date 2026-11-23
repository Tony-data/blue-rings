import { CountUp, type CountFormat } from "@/components/count-up";
import { number } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

type Ok = Extract<Portfolio, { status: "ok" }>;
type Row = { label: string; value: number; kind: CountFormat; tone: string };

/** Big figures that alternate sides and slide in as you scroll. */
export function StatRows({ data }: { data: Ok }) {
  const rows: Row[] = [];
  if (data.profit30d !== null) {
    rows.push({
      label: "Profit, last 30 days",
      value: data.profit30d,
      kind: "signedMoney",
      tone: data.profit30d < 0 ? "text-slate" : "text-blue",
    });
  }
  if (data.winRate !== null) {
    rows.push({
      label: `Win rate · ${number(data.marketsClosed)} closed markets`,
      value: data.winRate,
      kind: "percent",
      tone: "text-ink",
    });
  }
  if (data.tradeCount !== null) rows.push({ label: "Trades", value: data.tradeCount, kind: "number", tone: "text-ink" });
  if (data.volumeUsd !== null) rows.push({ label: "Volume traded", value: data.volumeUsd, kind: "compactMoney", tone: "text-ink" });

  if (!rows.length) return null;

  return (
    <section aria-label="Key figures" className="overflow-x-clip">
      <dl className="mx-auto max-w-7xl border-t border-blue/25 px-5 sm:px-8 mt-16 sm:mt-24">
        {rows.map((row, i) => {
          const right = i % 2 === 1;
          return (
            <div
              key={row.label}
              data-reveal={right ? "right" : "left"}
              className={`flex flex-col border-b border-blue/25 py-8 sm:py-11 ${right ? "items-end text-right" : "items-start"}`}
            >
              <dt className="order-2 mt-3 text-xs tracking-[0.16em] text-ink-2 uppercase sm:text-sm">{row.label}</dt>
              <dd className={`display order-1 text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.95] ${row.tone}`}>
                <CountUp value={row.value} kind={row.kind} align={right ? "right" : "left"} />
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
