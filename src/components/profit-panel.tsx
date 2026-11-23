"use client";

import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { compactMoney, monthYear, pnlTone, shortDate, signedMoney } from "@/lib/format";
import type { PnlPoint } from "@/lib/types";

const DAY = 86_400_000;
const RANGES = [
  { key: "1M", label: "1M", days: 30, phrase: "in the last month" },
  { key: "3M", label: "3M", days: 91, phrase: "in the last 3 months" },
  { key: "6M", label: "6M", days: 182, phrase: "in the last 6 months" },
  { key: "1Y", label: "1Y", days: 365, phrase: "in the last year" },
  { key: "ALL", label: "All", days: Infinity, phrase: "all time" },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];

// Chart colours (match globals.css tokens)
const BLUE = "#0149fd";
const SLATE = "#4d5558";
const GRID = "#e7e9e7";
const AXIS_TEXT = "#646a64";
const CROSSHAIR = "#989c94";
const SURFACE = "#fbfbfa";

export function ProfitPanel({ series }: { series: PnlPoint[] }) {
  const [range, setRange] = useState<RangeKey>("ALL");
  const [showTable, setShowTable] = useState(false);
  const gradientId = useId().replace(/:/g, "");

  const active = RANGES.find((r) => r.key === range)!;
  const data = useMemo(() => {
    if (!series.length || active.days === Infinity) return series;
    const cutoff = series[series.length - 1].t - active.days * DAY;
    const startIdx = series.findIndex((p) => p.t >= cutoff);
    return series.slice(Math.max(0, startIdx - 1));
  }, [series, active.days]);

  // "All" is measured from zero so it matches the all-time headline; other
  // ranges are measured from the first point in the range.
  const baseline = active.days === Infinity ? 0 : (data[0]?.v ?? 0);
  const change = data.length ? data[data.length - 1].v - baseline : 0;
  const values = data.map((p) => p.v);
  const max = Math.max(0, ...values);
  const min = Math.min(0, ...values);
  // Where zero sits inside the plot, for the blue-above / slate-below split.
  const zeroAt = max === min ? 1 : max / (max - min);
  const spanDays = data.length > 1 ? (data[data.length - 1].t - data[0].t) / DAY : 0;

  return (
    <div>
      {/* Filter row: sits above the chart and scopes everything below it */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Time range" className="inline-flex rounded-lg border border-line bg-surface p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={`min-w-11 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                range === r.key ? "bg-ink text-white" : "text-slate hover:bg-line/60 hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          className="text-sm text-slate underline decoration-line underline-offset-4 transition hover:text-ink hover:decoration-stone"
        >
          {showTable ? "Show chart" : "View as table"}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface p-5 sm:p-8">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className={`text-3xl font-semibold tracking-tight ${pnlTone(change)}`}>
            {signedMoney(change)}
          </span>
          <span className="text-slate">{active.phrase}</span>
        </p>

        {showTable ? (
          <MonthlyTable data={data} baseline={baseline} />
        ) : (
          <div className="mt-6 h-[300px] sm:h-[360px]" aria-label={`Cumulative profit chart, ${active.phrase}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`stroke-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={zeroAt} stopColor={BLUE} />
                    <stop offset={zeroAt} stopColor={SLATE} />
                  </linearGradient>
                  <linearGradient id={`fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset={0} stopColor={BLUE} stopOpacity={0.14} />
                    <stop offset={zeroAt} stopColor={BLUE} stopOpacity={0.04} />
                    <stop offset={zeroAt} stopColor={SLATE} stopOpacity={0.04} />
                    <stop offset={1} stopColor={SLATE} stopOpacity={0.14} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
                <XAxis
                  dataKey="t"
                  type="number"
                  scale="time"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(t: number) => (spanDays > 400 ? monthYear(t) : shortDate(t).replace(/ \d{4}$/, ""))}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: GRID }}
                  minTickGap={48}
                  tickMargin={10}
                />
                <YAxis
                  tickFormatter={(v: number) => compactMoney(v)}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickCount={5}
                  domain={[min, "auto"]}
                />
                {min < 0 && <ReferenceLine y={0} stroke={CROSSHAIR} strokeWidth={1} />}
                <Tooltip
                  cursor={{ stroke: CROSSHAIR, strokeWidth: 1 }}
                  content={ChartTooltip}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  name="Profit"
                  stroke={`url(#stroke-${gradientId})`}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={`url(#fill-${gradientId})`}
                  baseValue={0}
                  isAnimationActive={false}
                  dot={false}
                  activeDot={{ r: 5, fill: BLUE, stroke: SURFACE, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload }: Pick<TooltipContentProps, "active" | "payload">) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as PnlPoint;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-[0_8px_24px_-12px_rgba(14,23,30,0.35)]">
      <p className="text-base font-semibold text-ink tabular">{signedMoney(point.v, 2)}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
        <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: point.v < 0 ? SLATE : BLUE }} aria-hidden />
        Total profit · {shortDate(point.t)}
      </p>
    </div>
  );
}

/** Table view: profit made in each month, plus the running total. */
function MonthlyTable({ data, baseline }: { data: PnlPoint[]; baseline: number }) {
  const rows = useMemo(() => {
    const byMonth = new Map<string, { t: number; end: number }>();
    for (const p of data) {
      const d = new Date(p.t);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      byMonth.set(key, { t: Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1), end: p.v });
    }
    const months = [...byMonth.values()];
    let prev = baseline;
    return months
      .map((m) => {
        const row = { t: m.t, change: m.end - prev, total: m.end };
        prev = m.end;
        return row;
      })
      .reverse();
  }, [data, baseline]);

  return (
    <div className="mt-6 max-h-[360px] overflow-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">Profit by month</caption>
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-line text-left text-slate">
            <th scope="col" className="py-2 pr-4 font-medium">Month</th>
            <th scope="col" className="py-2 pr-4 text-right font-medium">Profit in month</th>
            <th scope="col" className="py-2 text-right font-medium">Running total</th>
          </tr>
        </thead>
        <tbody className="tabular">
          {rows.map((r) => (
            <tr key={r.t} className="border-b border-line/70 last:border-0">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal text-ink">{monthYear(r.t)}</th>
              <td className={`py-2.5 pr-4 text-right font-medium ${pnlTone(r.change)}`}>{signedMoney(r.change)}</td>
              <td className="py-2.5 text-right text-ink">{signedMoney(r.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
