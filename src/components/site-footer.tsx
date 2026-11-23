import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions";
import { LinkedInLogo, MailIcon, XLogo } from "@/components/icons";
import { CONTACT, DISCLAIMER } from "@/lib/site-config";
import { getStrategy } from "@/lib/strategy";

const isReal = (href: string) => href !== "#" && href !== "";

export async function SiteFooter() {
  const { sections } = await getStrategy();
  const x = CONTACT.links.find((l) => /x\.com|twitter/i.test(l.href));
  const linkedin = CONTACT.links.find((l) => /linkedin/i.test(l.label));

  const socials = [
    x && isReal(x.href) ? { href: x.href, label: "Blue Rings on X", icon: <XLogo /> } : null,
    linkedin && isReal(linkedin.href) ? { href: linkedin.href, label: "LinkedIn", icon: <LinkedInLogo /> } : null,
    { href: `mailto:${CONTACT.email}`, label: "Email", icon: <MailIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <Link href="/" className="flex items-center gap-3 self-start" aria-label="Blue Rings home">
            <Image src="/brand/mark-white.png" alt="" width={48} height={41} className="h-9 w-auto" />
            <span className="display text-[2rem] leading-none">Blue Rings</span>
            <span className="ml-1 hidden border-l border-white/30 pl-4 text-sm text-on-ink-muted sm:inline">Prediction-market portfolio</span>
          </Link>

          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 lg:gap-x-20">
            <Column title="Overview" href="/">
              <FooterLink href="/#performance">Performance</FooterLink>
              <FooterLink href="/#wins">Recent wins</FooterLink>
            </Column>
            <Column title="Investment logic" href="/investment-logic">
              {sections.map((s) => (
                <FooterLink key={s.id} href={`/investment-logic#${s.id}`}>
                  {s.title}
                </FooterLink>
              ))}
            </Column>
            <Column title="Contact">
              <FooterLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</FooterLink>
              <li className="text-sm text-on-ink-muted">{CONTACT.location}</li>
              {CONTACT.links.filter((l) => isReal(l.href)).map((l) => (
                <FooterLink key={l.label} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </Column>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start gap-6 border-t border-white/15 py-8 md:flex-row md:items-center md:justify-between">
          <form action={logout}>
            <button type="submit" className="link-underline text-sm font-medium text-white">
              Lock site
            </button>
          </form>
          <p className="text-xs text-on-ink-muted md:text-center">Blue Rings · Private portfolio · Sydney, Australia</p>
          <ul className="flex items-center gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="ring-btn size-11 text-white hover:bg-white hover:text-ink"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-white/15 py-7 text-xs leading-relaxed text-on-ink-muted">{DISCLAIMER}</p>
      </div>
    </footer>
  );
}

function Column({ title, href, children }: { title: string; href?: string; children: ReactNode }) {
  return (
    <div>
      {href ? (
        <Link href={href} className="link-underline text-[0.95rem] font-semibold text-white">
          {title}
        </Link>
      ) : (
        <p className="text-[0.95rem] font-semibold text-white">{title}</p>
      )}
      <ul className="mt-5 space-y-3.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const className = "link-underline text-sm text-on-ink [overflow-wrap:anywhere] transition-colors hover:text-white";
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
