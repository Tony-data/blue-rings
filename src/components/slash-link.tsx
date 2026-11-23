import Link from "next/link";
import type { ReactNode } from "react";

/** Outlined button-style link with a slash that turns into an arrow on hover. */
export function SlashLink({
  href,
  children,
  variant = "blue",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "blue" | "light";
  className?: string;
}) {
  return (
    <Link href={href} className={`slash-btn group ${variant === "light" ? "slash-btn--light" : ""} ${className}`}>
      <span>{children}</span>
      <span className="slash" aria-hidden />
    </Link>
  );
}
