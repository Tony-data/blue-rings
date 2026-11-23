"use client";

import { useEffect } from "react";
import { Plus } from "@/components/icons";
import type { LogicSection } from "@/lib/strategy";

/**
 * Investment logic sections as an accordion (native <details>, so it works
 * without JavaScript too). A link like /investment-logic#position-sizing
 * opens that section and scrolls to it.
 */
export function LogicAccordion({ sections }: { sections: LogicSection[] }) {
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
      }
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <div className="accordion border-t border-line-strong">
      {sections.map((s, i) => (
        <details key={s.id} id={s.id} open={i === 0} className="group scroll-mt-28 border-b border-line-strong">
          <summary className="flex items-center gap-5 py-8 sm:gap-8 sm:py-10">
            <span className="eyebrow w-8 shrink-0 text-blue tabular">{String(i + 1).padStart(2, "0")}</span>
            <span className="display min-w-0 flex-1 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight text-ink">{s.title}</span>
            <span className="ring-btn size-11 text-blue sm:size-12">
              <span className="plus-icon">
                <Plus />
              </span>
            </span>
          </summary>
          {/* Content is the site owner's own markdown file (content/strategy.md). */}
          <div className="logic-prose max-w-3xl pb-12 sm:pl-16" dangerouslySetInnerHTML={{ __html: s.html }} />
        </details>
      ))}
    </div>
  );
}
