import type { ReactNode } from "react";
import { ParallaxImage } from "./parallax-image";
import { RippleWater } from "./ripple-water";
import { BANNER_PHOTO } from "@/lib/site-config";

/**
 * Full-width water photo (with ripples that follow the pointer) and a solid
 * blue panel overlapping its lower-right edge.
 */
export function PhotoHero({ children, short = false }: { children: ReactNode; short?: boolean }) {
  return (
    <section className="relative pt-18">
      <div className={`relative overflow-hidden ${short ? "h-[38svh] min-h-[260px] max-h-[440px]" : "h-[62svh] min-h-[360px] max-h-[700px]"}`}>
        <ParallaxImage src={BANNER_PHOTO} strength={0.12} priority />
        <RippleWater className="absolute inset-0 h-full w-full" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`relative ml-auto bg-blue text-white md:w-[64%] lg:w-[56%] ${
            short ? "-mt-28 px-7 py-10 sm:-mt-36 sm:px-12 sm:py-12" : "-mt-36 px-7 py-10 sm:-mt-56 sm:px-12 sm:py-14"
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
