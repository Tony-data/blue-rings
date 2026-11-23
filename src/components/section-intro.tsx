import type { ReactNode } from "react";

/** Two-column section opener: heading on the left, copy (and actions) on the right. */
export function SectionIntro({
  id,
  title,
  children,
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  title: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`grid gap-6 lg:grid-cols-2 lg:gap-16 ${className}`}>
      <Tag id={id} data-reveal="up" className="display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.06] text-ink">
        {title}
      </Tag>
      {children && (
        <div data-reveal="up" style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="space-y-7 lg:pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
