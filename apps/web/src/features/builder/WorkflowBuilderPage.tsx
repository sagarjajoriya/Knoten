import { ReactFlowProvider } from '@xyflow/react';
import { type ReactNode } from 'react';

import { NodeLibrary } from './components/NodeLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { WorkflowHistoryProvider } from './history/WorkflowHistoryProvider';
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
 * Owns the `ReactFlowProvider` so the Node Library, canvas, history, and
 * Properties Panel share one graph store; the bottom toolbar lands in a later
 * slice.
 */
export function WorkflowBuilderPage(): ReactNode {
  return (
    <ReactFlowProvider>
      <WorkflowHistoryProvider>
        <div className="flex h-full w-full">
          <NodeLibrary />
          <div className="bg-bg relative min-w-0 flex-1">
            <WorkflowCanvas defaultNodes={demoNodes} />
          </div>
          <PropertiesPanel />
        </div>
      </WorkflowHistoryProvider>
    </ReactFlowProvider>
  );
}
