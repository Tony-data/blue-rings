"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; r: number; max: number; speed: number; alpha: number; width: number };

/**
 * Transparent canvas laid over a water photo: rings spread out from the
 * pointer (and from the occasional "drop"), like rings on water — the
 * Blue Rings motif. Static when the visitor prefers reduced motion;
 * paused when off-screen.
 */
export function RippleWater({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    let lastDrop = 0;
    const ripples: Ripple[] = [];
    const last = { x: -1e4, y: -1e4 };

    function spawn(x: number, y: number, strength: number) {
      if (ripples.length > 60) ripples.shift();
      ripples.push({
        x,
        y,
        r: 2,
        max: 70 + strength * 170,
        speed: 0.9 + strength * 1.1,
        alpha: 0.6 + strength * 0.4,
        width: 1.2 + strength * 1.3,
      });
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
    }

    function frame(now: number) {
      if (!ctx) return;
      // ambient drops so the water is never completely still
      if (now - lastDrop > 1400) {
        lastDrop = now;
        spawn(Math.random() * width, Math.random() * height, 0.35 + Math.random() * 0.35);
      }
      ctx.clearRect(0, 0, width, height);
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += p.speed;
        const life = 1 - p.r / p.max;
        if (life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        // two rings per ripple, the inner one fainter, like a real drop. Each ring
        // is a soft dark halo under a white line so it reads on foam and on deep water.
        for (const [scale, fade] of [
          [1, 1],
          [0.62, 0.55],
        ] as const) {
          const a = p.alpha * life * fade;
          const w = p.width * (0.7 + life * 0.7);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * scale, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14,23,30,${(a * 0.45).toFixed(3)})`;
          ctx.lineWidth = w + 2.5;
          ctx.stroke();
          ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, a * 1.25).toFixed(3)})`;
          ctx.lineWidth = w;
          ctx.stroke();
        }
      }
      if (visible) raf = requestAnimationFrame(frame);
    }

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      if (Math.hypot(x - last.x, y - last.y) > 42) {
        last.x = x;
        last.y = y;
        spawn(x, y, 0.7);
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      spawn(x, y, 1);
      spawn(x, y, 0.7);
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className ?? ""}`} />;
}
