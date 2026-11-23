import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-slate sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/brand/mark.png" alt="" width={28} height={24} className="h-5 w-auto" />
          <span className="font-medium text-ink">Blue Rings</span>
        </div>
        <p className="max-w-xl sm:text-right">
          A personal track record, shared privately. Past results don&rsquo;t predict future ones, and nothing here is
          financial advice.
        </p>
      </div>
    </footer>
  );
}
