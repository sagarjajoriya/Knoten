import { type ReactNode } from 'react';

import { type RunItem } from '../types';

import { Panel } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

interface RecentRunsPanelProps {
  readonly runs: readonly RunItem[];
}

/**
 * Recent activity list (spec §03 — the second list that drives action). Dense
 * rows with reserved status colors and mono figures for ids/durations.
 */
export function RecentRunsPanel({ runs }: RecentRunsPanelProps): ReactNode {
  return (
    <Panel title="Recent runs" subtitle="Latest executions across this workspace">
      <ul>
        {runs.map((run) => (
          <li
            key={run.id}
            className="border-line flex items-center gap-3 border-b py-2 text-sm last:border-b-0"
          >
            <StatusPill tone={run.tone}>{run.statusLabel}</StatusPill>
            <span className="text-ink min-w-0 truncate font-medium">{run.workflow}</span>
            <span className="text-ink-3 hidden font-mono text-xs sm:inline">{run.id}</span>
            <span className="text-ink-3 ml-auto flex items-center gap-4 font-mono text-xs tabular-nums">
              <span className="hidden md:inline">{run.startedAt}</span>
              <span className="text-ink-2 w-12 text-right">{run.duration}</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
