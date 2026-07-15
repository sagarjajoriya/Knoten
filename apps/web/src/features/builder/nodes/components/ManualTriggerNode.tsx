import { type ReactNode } from 'react';

import { type BaseNodeData, type NodeComponentProps } from '../types';

import { BaseNode } from './BaseNode';

import { CursorIcon } from '@/components/icons';

/** Manual Trigger carries no extra config beyond the shared card fields. */
export type ManualTriggerData = BaseNodeData;

export function ManualTriggerNode({ data, selected }: NodeComponentProps): ReactNode {
  return (
    <BaseNode
      icon={CursorIcon}
      category="trigger"
      title={data.label}
      subtitle="Run on click"
      hasOutput
      selected={selected}
    />
  );
}
