import { Hero } from "@/components/hero";
import { ProfitPanel } from "@/components/profit-panel";
import { RecentWins } from "@/components/recent-wins";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Strategy } from "@/components/strategy";
import { getPortfolio } from "@/lib/portfolio";

export default async function Home() {
  const data = await getPortfolio();

  return (
    <>
      <SiteHeader />
      {data.source === "sample" && (
        <div className="bg-ink-2 text-on-ink">
          <p className="mx-auto max-w-6xl px-4 py-2 text-center text-sm sm:px-6">
            <span className="eyebrow mr-2 text-blue-soft">Sample data</span>
            These aren&rsquo;t your real numbers. The live site loads them from Polymarket.
          </p>
        </div>
      )}

      <main className="flex-1">
        {data.status === "ok" ? (
          <>
            <Hero data={data} />

            <section id="performance" aria-labelledby="performance-title" className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
              <SectionHeading id="performance-title" eyebrow="Profit over time" title="Performance" />
              <ProfitPanel series={data.series} />
            </section>

            <section id="wins" aria-labelledby="wins-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
              <SectionHeading id="wins-title" eyebrow="Closed positions" title="Recent wins" />
              <RecentWins wins={data.recentWins} best={data.bestWin} error={data.winsError} />
            </section>
          </>
        ) : (
          <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <div className="rounded-2xl border border-line bg-surface p-8">
              <p className="eyebrow text-muted">Performance</p>
              <p className="mt-3 text-lg text-ink">{data.message}</p>
              <p className="mt-4 font-mono text-xs break-words text-muted">Details: {data.reason}</p>
            </div>
          </section>
        )}

        <Strategy />
      </main>

      <SiteFooter />
    </>
  );
}

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="eyebrow text-muted">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
