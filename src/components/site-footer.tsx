import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions";
import { LinkedInLogo, MailIcon, XLogo } from "@/components/icons";
import { CONTACT, DISCLAIMER } from "@/lib/site-config";
import { getStrategy } from "@/lib/strategy";

const isReal = (href: string) => href !== "#" && href !== "";

/**
 * Footer laid out like the v2 (Citadel-style) design — logo left, link
 * columns right, a bottom row with lock / note / round social icons, then
 * the disclaimer — in the current light palette.
 */
export async function SiteFooter() {
  const { headings } = await getStrategy();
  const x = CONTACT.links.find((l) => /x\.com|twitter/i.test(l.href));
  const linkedin = CONTACT.links.find((l) => /linkedin/i.test(l.label));

  const socials = [
    x && isReal(x.href) ? { href: x.href, label: "Blue Rings on X", icon: <XLogo /> } : null,
    linkedin && isReal(linkedin.href) ? { href: linkedin.href, label: "LinkedIn", icon: <LinkedInLogo /> } : null,
    { href: `mailto:${CONTACT.email}`, label: "Email", icon: <MailIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <Link href="/" className="flex items-center gap-3 self-start" aria-label="Blue Rings home">
            <Image src="/brand/mark.png" alt="" width={48} height={41} className="h-9 w-auto" />
            <span className="display text-[2rem] leading-none text-blue">Blue Rings</span>
            <span className="ml-1 hidden border-l border-line pl-4 text-sm text-muted sm:inline">Prediction-market portfolio</span>
          </Link>

          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-[auto_auto_auto] lg:gap-x-20">
            <Column title="Overview" href="/">
              <FooterLink href="/#performance">Performance</FooterLink>
              <FooterLink href="/#wins">Recent wins</FooterLink>
            </Column>
            {/* six links: two short columns instead of one tall one; full width below the others on phones */}
            <Column
              title="Investment logic"
              href="/investment-logic"
              split={headings.length}
              className="order-last col-span-2 sm:order-none sm:col-span-1"
            >
              {headings.map((h) => (
                <FooterLink key={h.id} href={`/investment-logic#${h.id}`}>
                  {h.text}
                </FooterLink>
              ))}
            </Column>
            <Column title="Contact">
              <FooterLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</FooterLink>
              <li className="text-sm text-slate">{CONTACT.location}</li>
              {CONTACT.links.filter((l) => isReal(l.href)).map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </Column>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <form action={logout}>
            <button type="submit" className="group inline-flex items-center gap-1 text-sm font-medium text-blue">
              Lock site
              <span className="slash" aria-hidden />
            </button>
          </form>
          <p className="text-xs text-muted md:text-center">Blue Rings · Private portfolio · Figures refresh every 15 minutes</p>
          <ul className="flex items-center gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="ring-btn size-11 text-blue hover:bg-blue hover:text-white"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-line py-7 text-xs leading-relaxed text-muted">{DISCLAIMER}</p>
      </div>
    </footer>
  );
}

function Column({
  title,
  href,
  split,
  className = "",
  children,
}: {
  title: string;
  href?: string;
  /** When set (the number of links), lay the links out in two columns, filling down then across. */
  split?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      {href ? (
        <Link href={href} className="link-underline text-sm font-semibold text-blue">
          {title}
        </Link>
      ) : (
        <p className="text-sm font-semibold text-blue">{title}</p>
      )}
      {split ? (
        <ul
          className="mt-5 grid grid-flow-col gap-x-10 gap-y-3.5"
          style={{ gridTemplateRows: `repeat(${Math.ceil(split / 2)}, auto)` }}
        >
          {children}
        </ul>
      ) : (
        <ul className="mt-5 space-y-3.5">{children}</ul>
      )}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "link-underline text-sm text-slate [overflow-wrap:anywhere] transition-colors duration-300 hover:text-blue";
  return (
    <li>
      {/^https?:\/\//.test(href) ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    </li>
  );
}
