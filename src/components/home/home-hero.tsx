import { LocalTime } from "@/components/local-time";
import { PillLink } from "@/components/pill-link";
import { RingField } from "@/components/ring-field";
import { monthYear, signedMoney } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

/** Inner-page hero (investment logic): big title over the ring field. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  titleClassName = "text-blue",
  titleSize = "text-[clamp(4rem,13vw,11rem)]",
  tall = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  titleClassName?: string;
  titleSize?: string;
  tall?: boolean;
}) {
  return (
    <section
      className={`relative flex flex-col justify-end overflow-hidden pt-32 pb-14 sm:pb-20 ${tall ? "min-h-[88svh]" : "min-h-[62svh]"}`}
    >
      <RingField className="absolute inset-0 h-full w-full" />
      {/* soften the field into the page below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-paper" />

      <div className="relative mx-auto flex w-full max-w-7xl gap-6 px-5 sm:gap-10 sm:px-8">
        <div aria-hidden className="hidden flex-col items-center gap-4 self-end sm:flex">
          <span className="eyebrow rotate-180 text-blue [writing-mode:vertical-rl]">Scroll</span>
          <span className="scroll-cue-line" />
        </div>
        <div className="min-w-0">
          <p className="eyebrow text-blue">
            <span className="knockout">{eyebrow}</span>
          </p>
          <h1 className={`display mt-3 leading-[1] sm:mt-4 ${titleSize} ${titleClassName}`}>
            <span className="knockout-block">{title}</span>
          </h1>
          <p className="mt-5 max-w-3xl text-[clamp(1.05rem,1.7vw,1.4rem)] leading-[1.75] tracking-[0.03em] text-blue">
            <span className="knockout">{subtitle}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Home page top: the interactive ring field with a solid blue panel
 * overlapping its lower-right edge, holding the all-time profit.
 */
export function HomeHero({ data }: { data: Portfolio }) {
  return (
    <section className="relative pt-18">
      <div className="relative h-[62svh] max-h-[700px] min-h-[360px] overflow-hidden bg-paper">
        <RingField className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative -mt-36 ml-auto bg-blue px-7 py-10 text-white sm:-mt-56 sm:px-12 sm:py-14 md:w-[64%] lg:w-[56%]">
          {data.status === "ok" ? (
            <>
              <p className="eyebrow text-white/75">All-time profit · Polymarket</p>
              <h1 className="display mt-4 text-[clamp(3.25rem,8vw,6.75rem)] leading-[1.02]">{signedMoney(data.totalProfit)}</h1>
              <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/85">
                After fees, including rebates and rewards.
                {data.startedAt ? <> Trading since {monthYear(data.startedAt)}.</> : null} Updated <LocalTime ms={data.fetchedAt} />.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow text-white/75">Polymarket portfolio</p>
              <h1 className="display mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[1.02]">Blue Rings</h1>
              <p className="mt-5 max-w-md text-white/85">{data.message}</p>
              <p className="mt-3 font-mono text-xs break-words text-white/70">Details: {data.reason}</p>
            </>
          )}
          <div className="mt-9">
            <PillLink href="/#performance" variant="light" arrow>
              View performance
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}
