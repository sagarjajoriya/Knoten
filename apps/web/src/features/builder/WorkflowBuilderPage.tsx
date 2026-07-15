import { type ReactNode } from 'react';

import { WorkflowCanvas } from './components/WorkflowCanvas';

/**
 * Workflow Builder surface (spec §04) — the routed entry for editing a flow.
 * Hosts the full-bleed canvas; the builder chrome (top bar, node inspector,
 * bottom toolbar) and graph content land in later slices.
 */
export function WorkflowBuilderPage(): ReactNode {
  return (
    <div className="bg-bg h-full w-full">
      <WorkflowCanvas />
    </div>
  );
}
