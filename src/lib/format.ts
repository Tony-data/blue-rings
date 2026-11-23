const MINUS = "−";

const usd = (decimals: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
const usd0 = usd(0);
const usd2 = usd(2);
const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** "+$1,234" / "−$1,234" / "$0". */
export function signedMoney(v: number, decimals = 0): string {
  const f = decimals ? usd2 : usd0;
  const abs = f.format(Math.abs(v));
  const rounded = Number(Math.abs(v).toFixed(decimals));
  if (rounded === 0) return abs;
  return (v > 0 ? "+" : MINUS) + abs;
}

export function money(v: number, decimals = 0): string {
  return (decimals ? usd2 : usd0).format(v).replace("-", MINUS);
}

/** "$468K", "$1.2M". */
export function compactMoney(v: number): string {
  return usdCompact.format(v).replace("-", MINUS);
}

export function percent(v: number, decimals = 0): string {
  return `${(v * 100).toFixed(decimals)}%`;
}

export function signedPercent(v: number): string {
  const s = percent(Math.abs(v));
  return (v >= 0 ? "+" : MINUS) + s;
}

/** 0.42 -> "42¢". */
export function cents(p: number): string {
  return `${Math.round(p * 100)}¢`;
}

export function number(v: number): string {
  return new Intl.NumberFormat("en-US").format(v);
}

/** "23 Nov 2026" (UTC, so server and browser agree). */
export function shortDate(ms: number): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(ms);
}

/** "Nov 2026". */
export function monthYear(ms: number): string {
  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(ms);
}

/** Tone for a profit/loss value: profit = brand blue, loss = slate. */
export function pnlTone(v: number): string {
  return v < 0 ? "text-slate" : "text-blue";
}
