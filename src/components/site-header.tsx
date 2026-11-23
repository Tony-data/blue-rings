import Image from "next/image";
import { logout } from "@/app/actions";

const NAV = [
  { href: "#performance", label: "Performance" },
  { href: "#wins", label: "Wins" },
  { href: "#strategy", label: "Strategy" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Blue Rings, back to top">
          <Image src="/brand/mark.png" alt="" width={34} height={29} className="h-7 w-auto" priority />
          <span className="text-[1.05rem] font-semibold tracking-tight text-ink">Blue Rings</span>
        </a>

        <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-slate transition hover:bg-line/60 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <form action={logout} className="ml-auto sm:ml-2">
          <button
            type="submit"
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-slate transition hover:border-stone hover:text-ink"
            title="Lock the site on this device"
          >
            <span className="size-1.5 rounded-full bg-blue" aria-hidden />
            Private · Lock
          </button>
        </form>
      </div>
    </header>
  );
}
