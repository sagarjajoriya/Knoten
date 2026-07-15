import { useId, useState, type PointerEvent, type ReactNode } from 'react';

import { type TrendPoint } from '../types';

interface TrendChartProps {
  readonly data: readonly TrendPoint[];
}

const VIEW_W = 640;
const VIEW_H = 180;
const PAD_X = 10;
const PAD_TOP = 22;
const PAD_BOTTOM = 26;
const PLOT_W = VIEW_W - PAD_X * 2;
const PLOT_H = VIEW_H - PAD_TOP - PAD_BOTTOM;
const BASELINE = PAD_TOP + PLOT_H;

function formatRuns(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Single-series runs trend (spec §03). One accent hue, recessive gridlines, the
 * endpoint direct-labeled (no legend box for a single series), and a crosshair +
 * tooltip on hover — the dataviz defaults for a line/area chart.
 */
export function TrendChart({ data }: TrendChartProps): ReactNode {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const first = data[0];
  const last = data[data.length - 1];
  if (!first || !last) {
    return null;
  }

  const runs = data.map((point) => point.runs);
  const min = Math.min(...runs);
  const max = Math.max(...runs);
  const pad = (max - min) * 0.2 || 1;
  const domainMin = min - pad;
  const domainMax = max + pad;

  const x = (index: number): number => PAD_X + (index / (data.length - 1)) * PLOT_W;
  const y = (value: number): number =>
    PAD_TOP + PLOT_H - ((value - domainMin) / (domainMax - domainMin)) * PLOT_H;

  const fmt = (value: number): string => value.toFixed(2);
  const linePath = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${fmt(x(index))} ${fmt(y(point.runs))}`)
    .join(' ');
  const areaPath = `${linePath} L ${fmt(x(data.length - 1))} ${fmt(BASELINE)} L ${fmt(x(0))} ${fmt(BASELINE)} Z`;

  const midLabel = data[Math.floor(data.length / 2)]?.label ?? '';
  const hoverPoint = hoverIndex === null ? null : (data[hoverIndex] ?? null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    const index = Math.min(data.length - 1, Math.max(0, Math.round(fraction * (data.length - 1))));
    setHoverIndex(index);
  };

  const handlePointerLeave = (): void => {
    setHoverIndex(null);
  };

  const tooltipLeft =
    hoverIndex === null ? 0 : Math.min(88, Math.max(12, (hoverIndex / (data.length - 1)) * 100));

  return (
    <div className="relative" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <svg
        viewBox={`0 0 ${String(VIEW_W)} ${String(VIEW_H)}`}
        width="100%"
        height="auto"
        role="img"
        aria-label={`Daily runs over the last ${String(data.length)} days, rising from ${formatRuns(first.runs)} to ${formatRuns(last.runs)}.`}
        className="block"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((ratio) => {
          const gridY = PAD_TOP + PLOT_H * ratio;
          return (
            <line
              key={ratio}
              x1={PAD_X}
              y1={gridY}
              x2={VIEW_W - PAD_X}
              y2={gridY}
              stroke="var(--line)"
              strokeWidth={1}
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {hoverIndex !== null ? (
          <line
            x1={x(hoverIndex)}
            y1={PAD_TOP - 6}
            x2={x(hoverIndex)}
            y2={BASELINE}
            stroke="var(--line-strong)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ) : null}

        <circle
          cx={x(data.length - 1)}
          cy={y(last.runs)}
          r={4.5}
          fill="var(--accent)"
          stroke="var(--surface)"
          strokeWidth={2}
        />
        <text
          x={x(data.length - 1)}
          y={y(last.runs) - 10}
          textAnchor="end"
          fontSize={12}
          fontWeight={700}
          fill="var(--ink)"
          className="font-mono tabular-nums"
        >
          {formatRuns(last.runs)}
        </text>

        {hoverIndex !== null && hoverPoint ? (
          <circle
            cx={x(hoverIndex)}
            cy={y(hoverPoint.runs)}
            r={4}
            fill="var(--accent)"
            stroke="var(--surface)"
            strokeWidth={2}
          />
        ) : null}

        <g fontSize={9} fill="var(--ink-3)" className="font-mono">
          <text x={PAD_X} y={VIEW_H - 6}>
            {first.label}
          </text>
          <text x={VIEW_W / 2} y={VIEW_H - 6} textAnchor="middle">
            {midLabel}
          </text>
          <text x={VIEW_W - PAD_X} y={VIEW_H - 6} textAnchor="end">
            {last.label}
          </text>
        </g>
      </svg>

      {hoverPoint ? (
        <div
          className="rounded-input border-line-strong bg-surface shadow-e2 pointer-events-none absolute top-1 z-10 -translate-x-1/2 border px-2.5 py-1.5 text-xs"
          style={{ left: `${tooltipLeft.toFixed(2)}%` }}
        >
          <div className="text-ink-3 font-mono text-[9px] uppercase tracking-[0.08em]">
            {hoverPoint.fullLabel}
          </div>
          <div className="text-ink font-bold tabular-nums">{formatRuns(hoverPoint.runs)} runs</div>
          <div className="text-ink-3">{hoverPoint.successRate}% succeeded</div>
        </div>
      ) : null}
    </div>
  );
}
