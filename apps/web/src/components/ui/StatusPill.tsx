import { type ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type StatusTone = 'ok' | 'warn' | 'err' | 'idle' | 'run';

interface StatusPillProps {
  readonly tone: StatusTone;
  readonly children: ReactNode;
  readonly className?: string;
}

const toneClasses: Record<StatusTone, { pill: string; dot: string }> = {
  ok: { pill: 'bg-ok-soft text-ok', dot: 'bg-ok' },
  warn: { pill: 'bg-warn-soft text-warn', dot: 'bg-warn' },
  err: { pill: 'bg-err-soft text-err', dot: 'bg-err' },
  idle: { pill: 'bg-surface-2 text-ink-2', dot: 'bg-ink-3' },
  run: { pill: 'bg-accent-soft text-accent-text', dot: 'bg-accent' },
};

/**
 * Status pill (spec §13). Status is reserved and never color-alone — the pill
 * always carries a text label alongside its dot (spec §20). Reused across the
 * dashboard, runs, and execution surfaces.
 */
export function StatusPill({ tone, children, className }: StatusPillProps): ReactNode {
  const classes = toneClasses[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold',
        classes.pill,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 flex-none rounded-full', classes.dot)} aria-hidden />
      {children}
    </span>
  );
}
