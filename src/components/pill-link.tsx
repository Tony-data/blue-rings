import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

/** Rounded pill button-link. */
export function PillLink({
  href,
  children,
  variant = "solid",
  arrow = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "light" | "outline";
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`pill pill--${variant} ${className}`}>
      {children}
      {arrow && (
        <span className="pill-arrow">
          <ArrowRight />
        </span>
      )}
    </Link>
  );
}

/** Text link with an arrow that nudges on hover ("Read more →"). */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 font-medium ${className}`}>
      <span className="link-underline">{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight />
      </span>
    </Link>
  );
}
