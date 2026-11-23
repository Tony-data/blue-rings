import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { Marked } from "marked";

export type Heading = { id: string; text: string };

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-") || "section"
  );
}

/**
 * Reads content/strategy.md (your own words), renders it to HTML and lists
 * its ## headings for the contents panel and footer links.
 */
export async function getStrategy(): Promise<{ html: string; headings: Heading[] }> {
  "use cache";
  cacheLife("max");

  const file = path.join(process.cwd(), "content", "strategy.md");
  const markdown = await readFile(file, "utf8");

  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2) return `<h${depth}>${inner}</h${depth}>\n`;
        const plain = text.replace(/[*_`]/g, "").trim();
        const base = slugify(plain);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count ? `${base}-${count + 1}` : base;
        headings.push({ id, text: plain });
        return `<h2 id="${id}" data-reveal="up">${inner}</h2>\n`;
      },
    },
  });

  const html = await marked.parse(markdown);
  return { html, headings };
}
