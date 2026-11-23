import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { Marked, type Token, type TokensList } from "marked";

export type LogicSection = { id: string; title: string; html: string };

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
 * Reads content/strategy.md (your own words) and splits it at each `##`
 * heading. Each section becomes one row of the investment logic accordion
 * and one footer link. Anything before the first heading becomes the intro.
 */
export async function getStrategy(): Promise<{ intro: string; sections: LogicSection[] }> {
  "use cache";
  cacheLife("max");

  const file = path.join(process.cwd(), "content", "strategy.md");
  const markdown = await readFile(file, "utf8");
  const marked = new Marked();
  const tokens = marked.lexer(markdown);

  const render = (list: Token[]) => {
    const withLinks = Object.assign([...list], { links: (tokens as TokensList).links }) as TokensList;
    return marked.parser(withLinks);
  };

  const introTokens: Token[] = [];
  const raw: { title: string; tokens: Token[] }[] = [];
  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 2) {
      raw.push({ title: token.text.replace(/[*_`]/g, "").trim(), tokens: [] });
    } else if (raw.length) {
      raw[raw.length - 1].tokens.push(token);
    } else {
      introTokens.push(token);
    }
  }

  const seen = new Map<string, number>();
  const sections = raw.map(({ title, tokens: body }) => {
    const base = slugify(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { id: count ? `${base}-${count + 1}` : base, title, html: render(body) };
  });

  return { intro: render(introTokens), sections };
}
