import { type ReactNode } from 'react';

import { type AttentionItem } from '../types';

import { CheckIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

interface NeedsAttentionPanelProps {
  readonly items: readonly AttentionItem[];
  readonly totalWorkflows: number;
}

/**
 * Failing or degraded workflows, worst first (spec §03). When nothing needs
 * attention it collapses to a single quiet "all healthy" line — health is the
 * default state, not an achievement banner.
 */
export function NeedsAttentionPanel({
  items,
  totalWorkflows,
}: NeedsAttentionPanelProps): ReactNode {
  return (
    <Panel title="Needs attention" subtitle="Failing or degraded workflows, worst first">
      {items.length === 0 ? (
        <div className="text-ink-2 flex items-center gap-2 py-2 text-sm">
          <CheckIcon width={16} height={16} className="text-ok flex-none" />
          All {totalWorkflows} workflows healthy
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="border-line flex items-center gap-3 border-b py-2 text-sm last:border-b-0"
            >
              <StatusPill tone={item.tone}>{item.statusLabel}</StatusPill>
              <span className="min-w-0">
                <span className="text-ink block truncate font-semibold">{item.name}</span>
                <span className="text-ink-3 block truncate text-xs">{item.meta}</span>
              </span>
              <Button
                size="sm"
                variant={item.action === 'Fix' ? 'secondary' : 'ghost'}
                className="ml-auto"
              >
                {item.action}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
