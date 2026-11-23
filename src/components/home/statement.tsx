import { ParallaxImage } from "@/components/parallax-image";
import { SlashLink } from "@/components/slash-link";
import { BANNER_PHOTO, STATEMENT } from "@/lib/site-config";

/** Brand banner with a statement card overlapping it. */
export function Statement() {
  return (
    <section aria-label="About this portfolio" className="relative">
      <div className="relative h-[46svh] min-h-[300px] max-h-[560px]">
        <ParallaxImage src={BANNER_PHOTO.src} />
        <p className="absolute top-4 right-4 rounded-full bg-ink/45 px-3 py-1 text-[0.7rem] text-white/90 backdrop-blur-sm sm:top-6 sm:right-6">
          {BANNER_PHOTO.caption} · Photo:{" "}
          <a href={BANNER_PHOTO.creditUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
            {BANNER_PHOTO.credit}
          </a>
        </p>
      </div>
      <div className="relative -mt-32 sm:-mt-48">
        {/* the card: runs from the left edge to just short of the right, with one big rounded corner */}
        <div aria-hidden className="absolute inset-y-0 left-0 right-[5%] rounded-tr-[56px] bg-paper sm:rounded-tr-[96px]" />
        <div className="relative mx-auto max-w-7xl px-5 pt-14 pb-4 sm:px-8 sm:pt-20">
          <p data-reveal="up" className="display max-w-6xl pr-[5%] text-[clamp(1.75rem,3.7vw,3.25rem)] leading-[1.15] text-blue">
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
