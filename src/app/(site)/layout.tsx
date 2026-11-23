import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Shared chrome for every signed-in page (the login page sits outside this group). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const sample = process.env.DATA_SOURCE === "sample";
  return (
    <>
      <SiteHeader sample={sample} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
