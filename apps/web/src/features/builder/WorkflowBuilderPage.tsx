import { ReactFlowProvider } from '@xyflow/react';
import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { NodeLibrary } from './components/NodeLibrary';
import { PropertiesPanel } from './components/PropertiesPanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { WorkflowToolbar } from './components/WorkflowToolbar';
import { WorkflowHistoryProvider } from './history/WorkflowHistoryProvider';
import { createNode } from './nodes/registry';
import { type KnotenNode } from './nodes/types';
import { type WorkflowMetadata } from './persistence/workflow-mapper';

// Temporary demo seed so the registered node types are visible on the canvas
// until the builder's graph state and node insertion land. Built from the
// registry, so it stays correct as node definitions change.
const demoNodes: readonly KnotenNode[] = [
  createNode('manual-trigger', { x: 96, y: 150 }, 'demo-manual-trigger'),
  createNode('http-request', { x: 380, y: 150 }, 'demo-http-request'),
];

/**
 * Workflow Builder surface (spec §04–05) — the routed entry for editing a flow.
 * Owns the `ReactFlowProvider` so the Node Library, canvas, Properties Panel, and
 * persistence toolbar share one graph store. Workflow metadata lives here so it
 * survives a load (the restored document's metadata replaces it).
 */
export function WorkflowBuilderPage(): ReactNode {
  const { flowId = 'demo' } = useParams();
  const [metadata, setMetadata] = useState<WorkflowMetadata>(() => ({
    id: flowId,
    name: 'Untitled workflow',
  }));

  return (
    <ReactFlowProvider>
      <WorkflowHistoryProvider>
        <div className="flex h-full w-full">
          <NodeLibrary />
          <div className="bg-bg relative min-w-0 flex-1">
            <WorkflowCanvas defaultNodes={demoNodes} />
            <WorkflowToolbar metadata={metadata} onMetadataChange={setMetadata} />
          </div>
          <PropertiesPanel />
        </div>
      </WorkflowHistoryProvider>
    </ReactFlowProvider>
  );
}
