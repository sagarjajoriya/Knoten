import { type StatDelta } from '@/components/ui/StatTile';
import { type StatusTone } from '@/components/ui/StatusPill';

export interface StatTileData {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly delta?: StatDelta;
  readonly critical?: boolean;
}

export interface TrendPoint {
  /** Short axis label, e.g. "Jul 13". */
  readonly label: string;
  /** Full tooltip date, e.g. "Wed · Jul 13". */
  readonly fullLabel: string;
  readonly runs: number;
  readonly successRate: number;
}

export interface AttentionItem {
  readonly id: string;
  readonly name: string;
  readonly tone: Extract<StatusTone, 'err' | 'warn'>;
  readonly statusLabel: string;
  readonly meta: string;
  /** Primary recovery action for this row (spec §18 — the fix is a button). */
  readonly action: 'Fix' | 'View';
}

export interface RunItem {
  readonly id: string;
  readonly workflow: string;
  readonly tone: StatusTone;
  readonly statusLabel: string;
  readonly startedAt: string;
  readonly duration: string;
}

export interface DashboardData {
  readonly tiles: readonly StatTileData[];
  readonly trend: readonly TrendPoint[];
  readonly attention: readonly AttentionItem[];
  readonly recentRuns: readonly RunItem[];
  readonly totalWorkflows: number;
}
