import { type ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface PanelProps {
  readonly title?: string;
  readonly subtitle?: string;
  /** Optional trailing control shown in the panel header (e.g. a "View all" link). */
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Surface card with an optional titled header (spec §03 `.dash-panel`). A neutral
 * container reused for dashboard modules and other panelled surfaces.
 */
export function Panel({ title, subtitle, action, children, className }: PanelProps): ReactNode {
  return (
    <section className={cn('bg-surface p-4', className)}>
      {(Boolean(title) || Boolean(action)) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-ink text-sm font-semibold">{title}</h2> : null}
            {subtitle ? <p className="text-ink-3 mt-0.5 text-xs">{subtitle}</p> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
