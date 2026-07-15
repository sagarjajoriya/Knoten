import { type ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface LogoProps {
  /** Hide the wordmark, leaving only the mark (collapsed rail). */
  readonly markOnly?: boolean;
}

/**
 * Product mark + wordmark for the rail. The mark is a self-contained accent tile
 * (brand color, not a status token); the wordmark hides in the collapsed rail.
 */
export function Logo({ markOnly = false }: LogoProps): ReactNode {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="rounded-btn bg-accent text-on-accent flex h-7 w-7 flex-none items-center justify-center text-sm font-bold"
        aria-hidden
      >
        K
      </span>
      <span className={cn('text-ink text-base font-bold tracking-tight', markOnly && 'lg:sr-only')}>
        Knoten
      </span>
    </span>
  );
}
