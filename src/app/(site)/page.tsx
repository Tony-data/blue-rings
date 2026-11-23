import { HomeHero } from "@/components/home/home-hero";
import { LogicCta } from "@/components/home/logic-cta";
import { StatRows } from "@/components/home/stat-rows";
import { Statement } from "@/components/home/statement";
import { ProfitPanel } from "@/components/profit-panel";
import { RecentWins } from "@/components/recent-wins";
import { SectionHeading } from "@/components/section-heading";
import { getPortfolio } from "@/lib/portfolio";

export default async function Home() {
  const data = await getPortfolio();

  return (
    <>
      <HomeHero data={data} />
      <Statement />

      {data.status === "ok" ? (
        <>
          <StatRows data={data} />

          <section aria-labelledby="performance-title" id="performance" className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-40">
            <SectionHeading id="performance-title" index="01" eyebrow="Profit over time" title="Performance" />
            <div data-reveal="up">
              <ProfitPanel series={data.series} />
            </div>
          </section>

          <section aria-labelledby="wins-title" id="wins" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
            <SectionHeading id="wins-title" index="02" eyebrow="Closed positions" title="Recent wins" />
            <RecentWins wins={data.recentWins} best={data.bestWin} error={data.winsError} />
          </section>
        </>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="border-y border-blue/25 py-8">
            <p className="eyebrow text-muted">Performance</p>
            <p className="mt-3 text-lg text-ink">{data.message}</p>
            <p className="mt-4 font-mono text-xs break-words text-muted">Details: {data.reason}</p>
          </div>
        </section>
      )}

      <LogicCta index="03" />
    </>
  );
}
