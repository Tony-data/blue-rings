"use client";

import { useEffect, useRef } from "react";

// Calm rings blend between these: ink → brand blue → soft blue.
const STOPS: [number, number, number][] = [
  [14, 23, 30],
  [1, 73, 253],
  [127, 164, 255],
];
const BUCKETS = 8;
const CALM = Array.from({ length: BUCKETS }, (_, i) => {
  const t = i / (BUCKETS - 1);
  const [a, b, k] = t < 0.5 ? [STOPS[0], STOPS[1], t * 2] : [STOPS[1], STOPS[2], (t - 0.5) * 2];
  const c = a.map((v, j) => Math.round(v + (b[j] - v) * k));
  return `rgba(${c[0]},${c[1]},${c[2]},0.7)`;
});
// Rings near the pointer "flash" like a blue-ringed octopus.
const FLASH = "rgba(1,73,253,1)";

type Wave = { x: number; y: number; born: number };

/**
 * A field of small rings that swell and shrink in slow travelling waves,
 * like ripples on water. Near the pointer the rings flash brand blue and
 * pulse outward; a click or tap sends a ripple across the field.
 * Static (one frame) when the visitor prefers reduced motion; paused off-screen.
 */
export function RingField({ className, spacing = 30, radius = 210 }: { className?: string; spacing?: number; radius?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let radii = new Float32Array(0);
    let primed = false;
    let raf = 0;
    let running = false;
    const started = performance.now();
    const pointer = { x: -1e4, y: -1e4, active: false };
    const waves: Wave[] = [];

    const BASE = 3.45; // resting ring radius (px)
    const MAX = 13; // keeps the largest rings from touching their neighbours
    // slow travelling waves in ring size, range about -1..1
    const swell = (x: number, y: number, t: number) =>
      Math.sin(x * 0.011 - t * 0.0016) * 0.5 + Math.sin(y * 0.013 + t * 0.0012) * 0.3 + Math.sin((x + y) * 0.006 - t * 0.0009) * 0.2;
    const tone = (x: number, y: number, t: number) =>
      0.5 + 0.5 * Math.sin(x * 0.0026 - y * 0.0019 + t * 0.00009 + Math.cos(y * 0.004) * 0.8);

    function draw(now: number) {
      if (!ctx) return;
      const t = reduce ? 0 : now - started;
      ctx.clearRect(0, 0, width, height);
      const calm = CALM.map(() => new Path2D());
      const flash = new Path2D();

      // drop click ripples once they have crossed the field
      for (let i = waves.length - 1; i >= 0; i--) if (now - waves[i].born > 2600) waves.splice(i, 1);

      for (let j = 0; j < rows; j++) {
        const y = j * spacing + spacing / 2;
        for (let i = 0; i < cols; i++) {
          const x = i * spacing + spacing / 2;
          let target = BASE * (1 + 0.55 * swell(x, y, t));
          let hot = 0;

          if (pointer.active) {
            const d = Math.hypot(pointer.x - x, pointer.y - y);
            if (d < radius) {
              const k = (1 - d / radius) ** 2;
              // concentric pulses spreading out from the pointer
              target += k * (4.8 + 3.6 * Math.sin(d * 0.09 - t * 0.008));
              hot = Math.max(hot, k);
            }
          }
          for (const w of waves) {
            const age = now - w.born;
            const front = age * 0.55;
            const d = Math.hypot(w.x - x, w.y - y);
            const off = Math.abs(d - front);
            if (off < 50) {
              const k = (1 - off / 50) * (1 - age / 2600);
              target += 6.3 * k;
              hot = Math.max(hot, k * 0.9);
            }
          }

          const idx = j * cols + i;
          const r = primed ? radii[idx] + (target - radii[idx]) * 0.2 : target;
          radii[idx] = r;
          const rr = Math.min(MAX, Math.max(0.9, r));
          const path = hot > 0.28 ? flash : calm[Math.min(BUCKETS - 1, Math.floor(tone(x, y, t) * BUCKETS))];
          path.moveTo(x + rr, y);
          path.arc(x, y, rr, 0, Math.PI * 2);
        }
      }
      primed = true;
      ctx.lineWidth = 1.3;
      calm.forEach((p, i) => {
        ctx.strokeStyle = CALM[i];
        ctx.stroke(p);
      });
      ctx.lineWidth = 1.9;
      ctx.strokeStyle = FLASH;
      ctx.stroke(flash);
    }

    function frame(now: number) {
      draw(now);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing);
      rows = Math.ceil(height / spacing);
      radii = new Float32Array(cols * rows);
      primed = false;
      draw(performance.now());
    }

    function local(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height };
    }
    function onPointerMove(e: PointerEvent) {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.x > -radius && p.y > -radius && p.x < p.w + radius && p.y < p.h + radius;
    }
    function onPointerDown(e: PointerEvent) {
      const p = local(e);
      if (p.x < 0 || p.y < 0 || p.x > p.w || p.y > p.h || reduce) return;
      if (waves.length > 6) waves.shift();
      waves.push({ x: p.x, y: p.y, born: performance.now() });
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [spacing, radius]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className ?? ""}`} />;
}
