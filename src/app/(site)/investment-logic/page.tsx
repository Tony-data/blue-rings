import type { Metadata } from "next";
import { LogicAccordion } from "@/components/logic-accordion";
import { PhotoHero } from "@/components/photo-hero";
import { PillLink } from "@/components/pill-link";
import { SectionIntro } from "@/components/section-intro";
import { LOGIC_INTRO } from "@/lib/site-config";
import { getStrategy } from "@/lib/strategy";

export const metadata: Metadata = {
  title: "Investment logic · Blue Rings",
};

export default async function InvestmentLogicPage() {
  const { intro, sections } = await getStrategy();

  return (
    <>
      <PhotoHero short>
        <p className="eyebrow text-white/75">Blue Rings · How I trade</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,6vw,5rem)] leading-[1.04]">Investment logic</h1>
        <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-white/85">How I find, size and manage positions.</p>
      </PhotoHero>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <SectionIntro title={<>{sections.length} parts of the process.</>}>
          <p className="max-w-xl text-lg leading-relaxed text-ink-2">{LOGIC_INTRO}</p>
          {/* Optional text before the first ## heading in content/strategy.md */}
          {intro.trim() && <div className="logic-prose max-w-xl" dangerouslySetInnerHTML={{ __html: intro }} />}
        </SectionIntro>
      </section>

      <section aria-label="Investment logic sections" className="bg-band py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <LogicAccordion sections={sections} />
          <div className="mt-14">
            <PillLink href="/#performance" arrow>
              See the track record
            </PillLink>
          </div>
        </div>
      </section>
    </>
  );
}
