import { type ReactNode } from 'react';

import { ArrowDownIcon, ArrowUpIcon, MinusIcon, type IconComponent } from '@/components/icons';
import { cn } from '@/lib/cn';

export type DeltaDirection = 'up' | 'down' | 'flat';
export type DeltaTone = 'positive' | 'negative' | 'neutral';

export interface StatDelta {
  /** Arrow glyph — the literal direction of movement. */
  readonly direction: DeltaDirection;
  /** Sentiment, which drives color independently of direction. */
  readonly tone: DeltaTone;
  /** Plain-language context, e.g. "vs yesterday" — carries the meaning. */
  readonly label: string;
}

interface StatTileProps {
  readonly label: string;
  readonly value: string;
  readonly delta?: StatDelta | undefined;
  /** Renders the value in the error color — reserved for the "act here" metric. */
  readonly critical?: boolean | undefined;
}

const directionIcon: Record<DeltaDirection, IconComponent> = {
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  flat: MinusIcon,
};

const toneClasses: Record<DeltaTone, string> = {
  positive: 'text-ok',
  negative: 'text-err',
  neutral: 'text-ink-3',
};

/**
 * Summary metric tile (spec §03). Number uses tabular figures; the delta pairs a
 * direction glyph with a sentiment color and a plain-language label, so the
 * meaning never rests on color alone (spec §20).
 */
export function StatTile({ label, value, delta, critical = false }: StatTileProps): ReactNode {
  const DeltaIcon = delta ? directionIcon[delta.direction] : null;

  return (
    <div className="bg-surface p-4">
      <div className="text-ink-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
        {label}
      </div>
      <div
        className={cn(
          'text-2xl font-bold tabular-nums leading-none tracking-tight',
          critical ? 'text-err' : 'text-ink',
        )}
      >
        {value}
      </div>
      {delta && DeltaIcon ? (
        <span
          className={cn(
            'mt-1.5 inline-flex items-center gap-1 text-xs font-semibold',
            toneClasses[delta.tone],
          )}
        >
          <DeltaIcon width={12} height={12} className="flex-none" />
          {delta.label}
        </span>
      ) : null}
    </div>
  );
}
