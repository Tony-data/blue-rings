import { SlashLink } from "@/components/slash-link";

/** Moving blue band that leads to the investment logic page. */
export function LogicCta({ index }: { index: string }) {
  return (
    <section aria-labelledby="logic-cta-title" className="aurora relative overflow-hidden text-white">
      <div
        aria-hidden
        className="hatch h-12 text-white/30 [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]"
      />
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-36">
        <p data-reveal="up" className="eyebrow text-white/80">
          {index} / How I trade
        </p>
        <h2 id="logic-cta-title" data-reveal="up" className="display mt-4 text-[clamp(3rem,8vw,7.25rem)] leading-[0.95]">
          Investment logic
        </h2>
        <p
          data-reveal="up"
          style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
        >
          How I pick markets, find an edge, size positions and manage risk.
        </p>
        <div data-reveal="up" style={{ "--reveal-delay": "180ms" } as React.CSSProperties} className="mt-10">
          <SlashLink href="/investment-logic" variant="light">
            Read the logic
          </SlashLink>
        </div>
      </div>
    </section>
  );
}
