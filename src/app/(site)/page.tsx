import { LocalTime } from "@/components/local-time";
import { StatsRow } from "@/components/home/stats-row";
import { PhotoHero } from "@/components/photo-hero";
import { PillLink } from "@/components/pill-link";
import { ProfitPanel } from "@/components/profit-panel";
import { BiggestWin, RecentWins } from "@/components/recent-wins";
import { SectionIntro } from "@/components/section-intro";
import { monthYear, signedMoney } from "@/lib/format";
import { getPortfolio } from "@/lib/portfolio";
import { INTRO_TITLE, STATEMENT } from "@/lib/site-config";

export default async function Home() {
  const data = await getPortfolio();

  return (
    <>
      <PhotoHero media="rings">
        {data.status === "ok" ? (
          <>
            <p className="eyebrow text-white/75">All-time profit · Polymarket</p>
            <h1 className="display mt-4 text-[clamp(3.25rem,8vw,6.75rem)] leading-[1.02]">{signedMoney(data.totalProfit)}</h1>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/85">
              After fees, including rebates and rewards.
              {data.startedAt ? <> Trading since {monthYear(data.startedAt)}.</> : null} Updated <LocalTime ms={data.fetchedAt} />.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow text-white/75">Polymarket portfolio</p>
            <h1 className="display mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[1.02]">Blue Rings</h1>
            <p className="mt-5 max-w-md text-white/85">{data.message}</p>
            <p className="mt-3 font-mono text-xs break-words text-white/70">Details: {data.reason}</p>
          </>
        )}
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <PillLink href="/#performance" variant="light" arrow>
            View performance
          </PillLink>
        </div>
      </PhotoHero>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionIntro title={INTRO_TITLE}>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2">{STATEMENT}</p>
          <PillLink href="/investment-logic">Explore the investment logic</PillLink>
        </SectionIntro>
      </section>

      {data.status === "ok" && (
        <>
          <StatsRow data={data} />

          <section id="performance" aria-labelledby="performance-title" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-28 sm:px-8 sm:pb-36">
            <SectionIntro id="performance-title" title="Performance">
              <p className="max-w-xl text-lg leading-relaxed text-ink-2">
                Cumulative profit after fees, day by day. Pick a range, hover for exact figures, or switch to a monthly table.
              </p>
            </SectionIntro>
            <div data-reveal="up" className="mt-14">
              <ProfitPanel series={data.series} />
            </div>
          </section>

          <section id="wins" aria-labelledby="wins-title" className="scroll-mt-18 bg-band py-24 sm:py-32">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
              <div data-reveal="up" className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                <div>
                  <h2 id="wins-title" className="display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.06] text-ink">
                    Recent wins
                  </h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
                    The latest closed positions that made money, newest first.
                  </p>
                </div>
                <BiggestWin win={data.winsError ? null : data.bestWin} />
              </div>
              <RecentWins wins={data.recentWins} error={data.winsError} />
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="logic-title" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionIntro id="logic-title" title="Investment logic">
          <p className="max-w-xl text-lg leading-relaxed text-ink-2">
            How I pick markets, find an edge, size positions and manage risk.
          </p>
          <PillLink href="/investment-logic" arrow>
            Read the investment logic
          </PillLink>
        </SectionIntro>
      </section>
    </>
  );
}
