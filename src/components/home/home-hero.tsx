import type { ReactNode } from "react";
import { LocalTime } from "@/components/local-time";
import { PillLink } from "@/components/pill-link";
import { RingField } from "@/components/ring-field";
import { monthYear, signedMoney } from "@/lib/format";
import type { Portfolio } from "@/lib/types";

/**
 * Top of every page: the interactive ring field with a solid blue panel
 * (white text) overlapping its lower-right edge.
 */
export function RingPanelHero({ children, short = false }: { children: ReactNode; short?: boolean }) {
  return (
    <section className="relative pt-18">
      <div
        className={`relative overflow-hidden bg-paper ${
          short ? "h-[42svh] max-h-[480px] min-h-[300px]" : "h-[62svh] max-h-[700px] min-h-[360px]"
        }`}
      >
        <RingField className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`relative ml-auto bg-blue px-7 py-10 text-white sm:px-12 sm:py-14 md:w-[64%] lg:w-[56%] ${
            short ? "-mt-28 sm:-mt-40" : "-mt-36 sm:-mt-56"
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

/** Home page version: the all-time profit. */
export function HomeHero({ data }: { data: Portfolio }) {
  return (
    <RingPanelHero>
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
    </RingPanelHero>
  );
}
