import { type ReactNode } from 'react';

import { NeedsAttentionPanel } from './components/NeedsAttentionPanel';
import { RecentRunsPanel } from './components/RecentRunsPanel';
import { TrendChart } from './components/TrendChart';
import { dashboardData } from './data/mock';

import { Panel } from '@/components/ui/Panel';
import { StatTile } from '@/components/ui/StatTile';

/**
 * Dashboard (Home) surface (spec §03). A monitoring surface first: four stat
 * tiles, one trend, then the two lists that drive action — what needs attention
 * and what ran recently. Sections are separated by hairlines and stack down to a
 * single column on small screens.
 */
export function DashboardPage(): ReactNode {
  const { tiles, trend, attention, recentRuns, totalWorkflows } = dashboardData;

  return (
    <div className="flex flex-col">
      <div className="border-line bg-line grid grid-cols-1 gap-px border-b sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile
            key={tile.id}
            label={tile.label}
            value={tile.value}
            delta={tile.delta}
            critical={tile.critical}
          />
        ))}
      </div>

      <div className="border-line bg-line grid grid-cols-1 gap-px border-b lg:grid-cols-[1.7fr_1fr]">
        <Panel title="Runs — last 14 days" subtitle="Hover any point for the daily breakdown">
          <TrendChart data={trend} />
        </Panel>
        <NeedsAttentionPanel items={attention} totalWorkflows={totalWorkflows} />
      </div>

      <RecentRunsPanel runs={recentRuns} />
    </div>
  );
}
