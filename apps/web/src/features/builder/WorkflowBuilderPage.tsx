import { type ReactNode } from 'react';

import { NodeLibrary } from './components/NodeLibrary';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { createNode } from './nodes/registry';
import { type KnotenNode } from './nodes/types';

// Temporary demo seed so the registered node types are visible on the canvas
// until the builder's graph state and node insertion land. Built from the
// registry, so it stays correct as node definitions change.
const demoNodes: readonly KnotenNode[] = [
  createNode('manual-trigger', { x: 96, y: 150 }, 'demo-manual-trigger'),
  createNode('http-request', { x: 380, y: 150 }, 'demo-http-request'),
];

/**
 * Workflow Builder surface (spec §04–05) — the routed entry for editing a flow.
 * Pairs the registry-driven Node Library with the canvas; the builder chrome
 * (top bar, node inspector, bottom toolbar) lands in later slices.
 */
export function WorkflowBuilderPage(): ReactNode {
  return (
    <div className="flex h-full w-full">
      <NodeLibrary />
      <div className="bg-bg relative min-w-0 flex-1">
        <WorkflowCanvas defaultNodes={demoNodes} />
      </div>
    </div>
  );
}
