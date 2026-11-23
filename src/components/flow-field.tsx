"use client";

import { useEffect, useRef } from "react";

// Palette stops the dashes blend between: ink → brand blue → soft blue.
const STOPS: [number, number, number][] = [
  [14, 23, 30],
  [1, 73, 253],
  [127, 164, 255],
];
const BUCKETS = 10;
const BUCKET_COLORS = Array.from({ length: BUCKETS }, (_, i) => {
  const t = i / (BUCKETS - 1);
  const [a, b, k] = t < 0.5 ? [STOPS[0], STOPS[1], t * 2] : [STOPS[1], STOPS[2], (t - 0.5) * 2];
  const c = a.map((v, j) => Math.round(v + (b[j] - v) * k));
  return `rgba(${c[0]},${c[1]},${c[2]},0.85)`;
});

const PI = Math.PI;
/** Shortest difference between two line orientations (lines repeat every π). */
function lineDelta(from: number, to: number) {
  const d = (((to - from) % PI) + PI * 1.5) % PI;
  return d - PI / 2;
}

/**
 * A field of short dashes whose angles drift in slow waves. Dashes near the
 * pointer turn towards it. Static (single frame) when the visitor prefers
 * reduced motion; paused when off-screen.
 */
export function FlowField({ className, spacing = 28, radius = 190 }: { className?: string; spacing?: number; radius?: number }) {
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
    let angles = new Float32Array(0);
    let primed = false;
    let raf = 0;
    let running = false;
    const started = performance.now();
    const pointer = { x: -1e4, y: -1e4, active: false };

    const field = (x: number, y: number, t: number) =>
      Math.sin(x * 0.0042 + t * 0.00022) * 1.15 +
      Math.cos(y * 0.0058 - t * 0.00018) * 1.05 +
      Math.sin((x + y) * 0.0021 + t * 0.00013) * 0.6;
    const tone = (x: number, y: number, t: number) =>
      0.5 + 0.5 * Math.sin(x * 0.0026 - y * 0.0019 + t * 0.00009 + Math.cos(y * 0.004) * 0.8);

    function draw(now: number) {
      if (!ctx) return;
      const t = reduce ? 0 : now - started;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.15;
      ctx.lineCap = "round";
      const paths = BUCKET_COLORS.map(() => new Path2D());

      for (let j = 0; j < rows; j++) {
        const y = j * spacing + spacing / 2;
        for (let i = 0; i < cols; i++) {
          const x = i * spacing + spacing / 2;
          let target = field(x, y, t);
          let len = 6.5;
          if (pointer.active) {
            const dx = pointer.x - x;
            const dy = pointer.y - y;
            const d = Math.hypot(dx, dy);
            if (d < radius) {
              const k = (1 - d / radius) ** 2;
              target += lineDelta(target, Math.atan2(dy, dx)) * k;
              len += 8 * k;
            }
          }
          const idx = j * cols + i;
          const current = primed ? angles[idx] + lineDelta(angles[idx], target) * 0.14 : target;
          angles[idx] = current;

          const hx = (Math.cos(current) * len) / 2;
          const hy = (Math.sin(current) * len) / 2;
          const bucket = Math.min(BUCKETS - 1, Math.floor(tone(x, y, t) * BUCKETS));
          paths[bucket].moveTo(x - hx, y - hy);
          paths[bucket].lineTo(x + hx, y + hy);
        }
      }
      primed = true;
      paths.forEach((p, i) => {
        ctx.strokeStyle = BUCKET_COLORS[i];
        ctx.stroke(p);
      });
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
      angles = new Float32Array(cols * rows);
      primed = false;
      draw(performance.now());
    }

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x > -radius && pointer.y > -radius && pointer.x < rect.width + radius && pointer.y < rect.height + radius;
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [spacing, radius]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
