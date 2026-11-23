import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions";
import { CONTACT, DISCLAIMER } from "@/lib/site-config";
import { getStrategy } from "@/lib/strategy";

export async function SiteFooter() {
  const { headings } = await getStrategy();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-8 sm:px-8 sm:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.4fr)] lg:gap-10">
          <Column title="Overview" href="/">
            <FooterLink href="/#performance">Performance</FooterLink>
            <FooterLink href="/#wins">Recent wins</FooterLink>
          </Column>

          <Column title="Investment logic" href="/investment-logic">
            {headings.map((h) => (
              <FooterLink key={h.id} href={`/investment-logic#${h.id}`}>
                {h.text}
              </FooterLink>
            ))}
          </Column>

          <Column title="Contact">
            <FooterLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</FooterLink>
            <li className="text-sm text-slate">{CONTACT.location}</li>
            {CONTACT.links.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </Column>

          <div className="col-span-2 lg:col-span-1 lg:pl-10">
            <p className="text-sm font-semibold text-blue">Disclaimer</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate">{DISCLAIMER}</p>
            <form action={logout} className="mt-6">
              <button type="submit" className="group inline-flex items-center gap-1 text-sm font-medium text-blue">
                Lock site
                <span className="slash" aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <p
          aria-hidden
          data-reveal="up"
          className="display mt-24 -ml-[0.04em] select-none whitespace-nowrap pb-[0.16em] text-[clamp(5rem,24.5vw,22.75rem)] leading-[0.82] text-blue sm:mt-32"
        >
          Blue Rings
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted">
          <span>Blue Rings · Private portfolio</span>
          <span>Figures refresh every 15 minutes</span>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, href, children }: { title: string; href?: string; children: ReactNode }) {
  return (
    <div>
      {href ? (
        <Link href={href} className="block text-sm font-semibold text-blue hover:underline hover:underline-offset-4">
          {title}
        </Link>
      ) : (
        <p className="block text-sm font-semibold text-blue">{title}</p>
      )}
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate underline decoration-transparent underline-offset-4 transition-colors duration-300 [overflow-wrap:anywhere] hover:text-blue hover:decoration-blue"
      >
        {children}
      </Link>
    </li>
  );
}
