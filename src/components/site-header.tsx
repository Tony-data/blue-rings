"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { logout } from "@/app/actions";
import { NAV } from "@/lib/site-config";

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const useScrolled = () =>
  useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 16,
    () => false,
  );

export function SiteHeader({ sample }: { sample: boolean }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  // While the mobile menu is open: Esc closes it and the page behind can't scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Full-screen mobile menu (sits behind the bar so the logo and close button stay on top) */}
      {open && (
        <div id="mobile-menu" className="fixed inset-0 flex flex-col bg-blue-mist px-5 pt-28 pb-10 sm:px-8 lg:hidden">
          <nav aria-label="Main">
            <ul className="space-y-3">
              {[{ href: "/", label: "Overview" }, ...NAV].map((item, i) => (
                <li key={item.href} className="menu-item" style={{ "--d": `${60 + i * 60}ms` } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="group inline-flex items-center gap-3 text-[2.6rem] leading-tight text-blue display"
                  >
                    {item.label}
                    <span className="slash scale-150" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form action={logout} className="menu-item mt-auto" style={{ "--d": "320ms" } as React.CSSProperties}>
            <button type="submit" className="group inline-flex items-center gap-1 text-lg text-blue">
              Lock site
              <span className="slash" aria-hidden />
            </button>
          </form>
        </div>
      )}

      {sample && (
        <div className="relative bg-ink-2 text-on-ink">
          <p className="mx-auto max-w-7xl px-5 py-1.5 text-center text-xs sm:px-8 sm:text-sm">
            <span className="eyebrow mr-2 text-blue-soft">Sample data</span>
            These aren&rsquo;t your real numbers. The live site loads them from Polymarket.
          </p>
        </div>
      )}

      <div
        className={`relative border-b transition-[background-color,border-color] duration-500 ${
          scrolled && !open ? "border-line/80 bg-paper/85 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-10 px-5 sm:px-8">
          <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2.5" aria-label="Blue Rings home">
            <Image src="/brand/mark.png" alt="" width={36} height={31} className="h-7 w-auto" priority />
            <span className="display text-[1.65rem] leading-none text-blue">Blue Rings</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="group inline-flex items-center gap-1 text-[0.95rem] text-blue"
                  >
                    {item.label}
                    <span className="slash" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action={logout} className="ml-auto hidden lg:block">
            <button type="submit" className="group inline-flex items-center gap-1 text-[0.95rem] text-blue" title="Lock the site on this device">
              Lock
              <span className="slash" aria-hidden />
            </button>
          </form>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ml-auto inline-flex items-center gap-3 text-[0.95rem] text-blue lg:hidden"
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-3 w-6" aria-hidden>
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
