import { ManualTriggerNode, type ManualTriggerData } from '../components/ManualTriggerNode';
import { defineNode } from '../types';

import { CursorIcon } from '@/components/icons';

/** Starts a workflow when the user runs it — the simplest trigger. */
export const manualTriggerDefinition = defineNode<ManualTriggerData>({
  type: 'manual-trigger',
  label: 'Manual Trigger',
  category: 'trigger',
  icon: CursorIcon,
  description: 'Start this workflow by running it yourself.',
  defaultData: { label: 'Manual Trigger' },
  component: ManualTriggerNode,
});
