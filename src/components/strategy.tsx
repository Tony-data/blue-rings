import { readFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { cacheLife } from "next/cache";
import { marked } from "marked";

/** Reads content/strategy.md (your own words) and renders it as HTML. */
async function getStrategyHtml(): Promise<string> {
  "use cache";
  cacheLife("max");
  const file = path.join(process.cwd(), "content", "strategy.md");
  const markdown = await readFile(file, "utf8");
  return marked.parse(markdown, { async: false });
}

export async function Strategy() {
  const html = await getStrategyHtml();

  return (
    <section id="strategy" aria-labelledby="strategy-title" className="bg-ink text-on-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Image src="/brand/mark-white.png" alt="" width={64} height={55} className="h-12 w-auto opacity-90" />
          <p className="eyebrow mt-8 text-on-ink-muted">How I trade</p>
          <h2 id="strategy-title" className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Strategy
          </h2>
        </div>
        {/* Content is the site owner's own markdown file, so rendering it as HTML is safe. */}
        <div className="strategy-prose max-w-2xl" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
