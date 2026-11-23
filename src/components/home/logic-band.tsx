import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { BANNER_PHOTO } from "@/lib/site-config";

/**
 * Dark band leading to the investment logic page: ring-mark badge on the top
 * edge, photo on the left, and a dashed "trajectory" line that draws itself in.
 */
export function LogicBand() {
  return (
    <section aria-labelledby="logic-band-title" className="relative mt-16 bg-ink text-white">
      {/* badge sitting on the top edge */}
      <div className="absolute top-0 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="grid size-20 place-items-center rounded-full bg-paper shadow-[0_0_0_6px_var(--ink)] sm:size-24">
          <Image src="/brand/mark.png" alt="" width={64} height={55} className="h-9 w-auto sm:h-11" />
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* dashed rising line with two dots, like a profit curve (wide screens only) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div data-reveal="draw" className="absolute inset-0">
          <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path
              d="M400 620 C 600 560, 780 500, 1020 330"
              fill="none"
              style={{ stroke: "var(--blue-soft)" }}
              strokeWidth={1.6}
              strokeDasharray="6 9"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          </div>
          {/* dots sit exactly on the curve, at t = 0.35 and t = 0.75 */}
          {[
            { left: "60.6%", top: "92%", delay: "900ms", pulse: "0s" },
            { left: "85%", top: "73.1%", delay: "1300ms", pulse: "1.4s" },
          ].map((d) => (
            <span
              key={d.left}
              data-reveal="up"
              style={{ left: d.left, top: d.top, "--reveal-delay": d.delay } as React.CSSProperties}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="pulse-dot block size-3.5 rounded-full bg-blue-soft" style={{ animationDelay: d.pulse }} />
            </span>
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div data-reveal="up" className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden lg:aspect-[4/5]">
            <Image
              src={BANNER_PHOTO}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "85% 40%" }}
            />
          </div>
          <div data-reveal="up" style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="max-w-xl">
            <p className="eyebrow text-blue-soft">How I trade</p>
            <h2 id="logic-band-title" className="display mt-4 text-[clamp(2.6rem,5.5vw,4.75rem)] leading-[1.02] text-white">
              Investment logic
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-on-ink">
              How I pick markets, find an edge, size positions and manage risk.
            </p>
            <Link href="/investment-logic" className="group mt-10 inline-flex items-center gap-4 text-white">
              <span className="ring-btn size-14 group-hover:bg-white group-hover:text-ink">
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <span className="link-underline font-medium">Read the investment logic</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
