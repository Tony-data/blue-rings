"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { logout } from "@/app/actions";
import { ArrowRight } from "@/components/icons";
import { NAV } from "@/lib/site-config";

const subscribeScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};
const useScrolled = () =>
  useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
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
  const dark = open;

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {open && (
        <div id="mobile-menu" className="fixed inset-0 flex flex-col bg-ink px-5 pt-28 pb-10 text-white sm:px-8 lg:hidden">
          <nav aria-label="Main">
            <ul className="border-t border-white/15">
              {[{ href: "/", label: "Overview" }, ...NAV].map((item, i) => (
                <li key={item.href} className="menu-item border-b border-white/15" style={{ "--d": `${60 + i * 60}ms` } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="group flex items-center justify-between py-5 text-[1.9rem] leading-tight display"
                  >
                    {item.label}
                    <span className="ring-btn size-11 text-white/80 group-hover:bg-white group-hover:text-ink">
                      <ArrowRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form action={logout} className="menu-item mt-auto" style={{ "--d": "320ms" } as React.CSSProperties}>
            <button type="submit" className="pill pill--light">
              Lock site
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
        className={`relative border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          dark
            ? "border-transparent bg-transparent text-white"
            : `bg-paper text-ink ${scrolled ? "border-line shadow-[0_8px_24px_-20px_rgba(14,23,30,0.5)]" : "border-transparent"}`
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-10 px-5 sm:px-8">
          <Link href="/" onClick={close} className="flex shrink-0 items-center gap-2.5" aria-label="Blue Rings home">
            <Image src={dark ? "/brand/mark-white.png" : "/brand/mark.png"} alt="" width={36} height={31} className="h-7 w-auto" priority />
            <span className={`display text-[1.45rem] leading-none ${dark ? "text-white" : "text-ink"}`}>Blue Rings</span>
          </Link>

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="link-underline text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-blue aria-[current=page]:text-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form action={logout} className="hidden lg:block">
            <button type="submit" className="pill pill--outline text-blue" title="Lock the site on this device">
              Lock
            </button>
          </form>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`ml-auto inline-flex items-center gap-3 text-[0.95rem] font-medium lg:hidden ${dark ? "text-white" : "text-ink"}`}
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-3 w-6" aria-hidden>
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
