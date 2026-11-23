import { ParallaxImage } from "@/components/parallax-image";
import { SlashLink } from "@/components/slash-link";
import { STATEMENT } from "@/lib/site-config";

/** Brand banner with a statement card overlapping it. */
export function Statement() {
  return (
    <section aria-label="About this portfolio" className="relative">
      <div className="relative h-[46svh] min-h-[300px] max-h-[560px]">
        <ParallaxImage src="/brand/banner.webp" />
      </div>
      <div className="relative -mt-32 sm:-mt-48">
        {/* the card: runs from the left edge to just short of the right, with one big rounded corner */}
        <div aria-hidden className="absolute inset-y-0 left-0 right-[5%] rounded-tr-[56px] bg-paper sm:rounded-tr-[96px]" />
        <div className="relative mx-auto max-w-7xl px-5 pt-14 pb-4 sm:px-8 sm:pt-20">
          <p data-reveal="up" className="display max-w-5xl pr-[5%] text-[clamp(2rem,4.4vw,3.9rem)] leading-[1.08] text-blue">
            {STATEMENT}
          </p>
          <div data-reveal="up" style={{ "--reveal-delay": "140ms" } as React.CSSProperties} className="mt-10">
            <SlashLink href="/investment-logic">Investment logic</SlashLink>
          </div>
        </div>
      </div>
    </section>
  );
}
