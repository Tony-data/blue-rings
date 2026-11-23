/** Small line icons (inherit currentColor). */

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

export function Plus({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className} aria-hidden>
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}

export function XLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={className} aria-hidden>
      <path d="M3 2.5h2.6L13 13.5h-2.6zM13 2.5 8.9 7.1M3 13.5l4.1-4.6" />
    </svg>
  );
}

export function LinkedInLogo({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <rect x="2" y="6" width="2.6" height="7.5" rx="0.4" />
      <circle cx="3.3" cy="3.4" r="1.45" />
      <path d="M6.5 6h2.5v1.1c.4-.7 1.3-1.3 2.6-1.3 2 0 2.9 1.2 2.9 3.4v4.3h-2.6V9.7c0-1-.4-1.6-1.3-1.6-.9 0-1.5.6-1.5 1.7v3.7H6.5z" />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2" y="3.5" width="12" height="9" rx="1.2" />
      <path d="m2.5 4.5 5.5 4.2 5.5-4.2" />
    </svg>
  );
}
