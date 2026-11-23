import type { Metadata } from "next";
import { RingPanelHero } from "@/components/home/home-hero";
import { PillLink } from "@/components/pill-link";
import { SlashLink } from "@/components/slash-link";
import { Toc } from "@/components/toc";
import { getStrategy } from "@/lib/strategy";

export const metadata: Metadata = {
  title: "Investment logic · Blue Rings",
};

export default async function InvestmentLogicPage() {
  const { html, headings } = await getStrategy();

  return (
    <>
      <RingPanelHero short>
        <p className="eyebrow text-white/75">Blue Rings · How I trade</p>
        {/* sized so "Investment logic" stays on one line inside the panel */}
        <h1 className="display mt-4 text-[clamp(2.4rem,5.6vw,4.75rem)] leading-[1.04]">Investment logic</h1>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/85">How I find, size and manage positions.</p>
        {headings[0] && (
          <div className="mt-9">
            <PillLink href={`#${headings[0].id}`} variant="light" arrow>
              Start reading
            </PillLink>
          </div>
        )}
      </RingPanelHero>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:self-start lg:sticky lg:top-28">
            <Toc items={headings} />
          </aside>
          {/* Content is the site owner's own markdown file (content/strategy.md). */}
          <article className="logic-prose max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        <div className="mt-24 flex flex-wrap items-center gap-6 border-t border-blue/25 pt-10 lg:ml-[20rem]">
          <SlashLink href="/#performance">See the track record</SlashLink>
        </div>
      </section>
    </>
  );
}
