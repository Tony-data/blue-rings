"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** A full-bleed image that drifts slightly slower than the page as you scroll. */
export function ParallaxImage({ src, strength = 0.18 }: { src: string; strength?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = frame.current;
    const inner = layer.current;
    if (!box || !inner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = box.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -strength;
      inner.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden" aria-hidden>
      <div ref={layer} className="absolute inset-x-0 -top-[18%] -bottom-[18%] will-change-transform">
        <Image src={src} alt="" fill sizes="100vw" className="object-cover object-center" />
      </div>
    </div>
  );
}
