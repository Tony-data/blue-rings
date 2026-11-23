import Image from "next/image";
import { LocalTime } from "./local-time";
import { compactMoney, monthYear, number, percent, pnlTone, signedMoney } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

type Ok = Extract<Portfolio, { status: "ok" }>;

export function Hero({ data }: { data: Ok }) {
  const tiles = [
    {
      label: "Last 30 days",
      value: data.profit30d === null ? "—" : signedMoney(data.profit30d),
      tone: data.profit30d === null ? "text-ink" : pnlTone(data.profit30d),
    },
    {
      label: "Win rate",
      value: data.winRate === null ? "—" : percent(data.winRate),
      note: data.marketsClosed ? `of ${number(data.marketsClosed)} closed markets` : undefined,
    },
    {
      label: "Trades",
      value: data.tradeCount === null ? "—" : number(data.tradeCount),
    },
    {
      label: "Volume traded",
      value: data.volumeUsd === null ? "—" : compactMoney(data.volumeUsd),
    },
  ];

  return (
    <section id="top" aria-labelledby="hero-label">
      <div className="relative h-[150px] overflow-hidden sm:h-[220px] lg:h-[280px]">
        <Image
          src="/brand/banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative -mt-14 rounded-2xl border border-line bg-surface p-6 shadow-[0_24px_60px_-36px_rgba(14,23,30,0.35)] sm:-mt-20 sm:p-10">
          <p id="hero-label" className="eyebrow text-muted">
            All-time profit
          </p>
          <p
            className={`mt-3 text-[clamp(3rem,10vw,5.75rem)] leading-none font-semibold tracking-[-0.035em] ${pnlTone(data.totalProfit)}`}
          >
            {signedMoney(data.totalProfit)}
          </p>
          <p className="mt-4 text-sm text-slate">
            After fees, including rebates and rewards
            {data.startedAt ? <> · trading since {monthYear(data.startedAt)}</> : null}
            {" · "}updated <LocalTime ms={data.fetchedAt} />
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="bg-surface p-4 sm:p-5">
                <dt className="text-sm text-slate">{tile.label}</dt>
                <dd className={`mt-1.5 text-2xl font-semibold tracking-tight sm:text-[1.75rem] ${tile.tone ?? "text-ink"}`}>
                  {tile.value}
                </dd>
                {tile.note && <dd className="mt-0.5 text-xs text-muted">{tile.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
