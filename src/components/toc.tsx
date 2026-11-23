"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Heading } from "@/lib/strategy";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
};

/** Contents list that highlights the section you're reading. */
export function Toc({ items }: { items: Heading[] }) {
  const first = items[0]?.id ?? "";
  const getActive = useCallback(() => {
    let current = first;
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.32) current = item.id;
    }
    return current;
  }, [items, first]);
  const active = useSyncExternalStore(subscribe, getActive, () => first);

  return (
    <nav aria-label="On this page">
      <p className="eyebrow text-muted">Contents</p>
      <ol className="mt-5 border-l border-line">
        {items.map((item, i) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px flex items-baseline gap-3 border-l py-2 pl-4 text-sm transition-colors duration-300 ${
                  isActive ? "border-blue text-blue" : "border-transparent text-slate hover:text-ink"
                }`}
              >
                <span className="eyebrow tabular">{String(i + 1).padStart(2, "0")}</span>
                <span>{item.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
