import { FlowField } from "@/components/flow-field";
import { LocalTime } from "@/components/local-time";
import { monthYear, signedMoney } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

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
      {/* fades in below the header so the menu stays clean */}
      <FlowField className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent_5rem,black_10rem)]" />
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

export function HomeHero({ data }: { data: Portfolio }) {
  if (data.status !== "ok") {
    return <PageHero eyebrow="Blue Rings · Polymarket portfolio" title="Blue Rings" subtitle={data.message} />;
  }
  const negative = data.totalProfit < 0;
  return (
    <PageHero
      eyebrow="All-time profit · Polymarket"
      title={signedMoney(data.totalProfit)}
      titleClassName={negative ? "text-slate" : "text-blue"}
      subtitle={
        <>
          After fees, including rebates and rewards.
          {data.startedAt ? <> Trading since {monthYear(data.startedAt)}.</> : null} Updated <LocalTime ms={data.fetchedAt} />.
        </>
      }
    />
  );
}
