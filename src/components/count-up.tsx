"use client";

import { useEffect, useRef } from "react";
import { compactMoney, number, percent, signedMoney } from "@/lib/format";

export type CountFormat = "signedMoney" | "percent" | "number" | "compactMoney";

function format(kind: CountFormat, v: number): string {
  switch (kind) {
    case "signedMoney":
      return signedMoney(v);
    case "percent":
      return percent(v);
    case "compactMoney":
      return compactMoney(v);
    default:
      return number(Math.round(v));
  }
}

/**
 * A number that counts up from zero the first time it scrolls into view.
 * The final value is rendered on the server (and kept for screen readers);
 * an invisible copy reserves its width so nothing shifts while counting.
 */
export function CountUp({
  value,
  kind,
  align = "left",
  className,
}: {
  value: number;
  kind: CountFormat;
  align?: "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = format(kind, value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already on screen: don't flash

    el.textContent = format(kind, 0);
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const t0 = performance.now();
        const duration = 1700;
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = p === 1 ? format(kind, value) : format(kind, value * eased);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, kind]);

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span aria-hidden className="invisible">
        {final}
      </span>
      <span ref={ref} aria-hidden className={`absolute inset-0 whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}>
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
