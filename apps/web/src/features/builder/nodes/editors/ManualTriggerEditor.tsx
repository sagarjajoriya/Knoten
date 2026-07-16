import { type ReactNode } from 'react';

/**
 * Properties editor for the Manual Trigger. It has no configuration yet, so the
 * panel shows a designed empty state rather than an blank form (spec §17).
 */
export function ManualTriggerEditor(): ReactNode {
  return (
    <p className="text-ink-3 text-sm leading-relaxed">
      This trigger fires when you run the workflow. It has no configuration.
    </p>
  );
}
