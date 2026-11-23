import type { Metadata } from "next";
import { PageHero } from "@/components/home/home-hero";
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
      <PageHero
        tall={false}
        titleBox="blue"
        titleSize="text-[clamp(2.5rem,8.5vw,7.5rem)]"
        eyebrow="Blue Rings · How I trade"
        title="Investment logic"
        subtitle="How I find, size and manage positions."
      />

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
