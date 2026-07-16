import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, type DragEvent, type ReactNode } from 'react';

import '@xyflow/react/dist/style.css';

import { getDraggedNodeType } from '../nodes/dnd';
import { nodeTypes } from '../nodes/node-types';
import { createNode } from '../nodes/registry';
import { type KnotenNode } from '../nodes/types';

import { useTheme } from '@/app/theme/useTheme';

// 16px = one canvas grid unit (spec §15 · the 4px spacing scale, `p-4`).
const GRID_UNIT = 16;

interface WorkflowCanvasProps {
  /** Nodes to seed the canvas with on mount. */
  readonly defaultNodes?: readonly KnotenNode[];
}

function WorkflowCanvasInner({ defaultNodes = [] }: WorkflowCanvasProps): ReactNode {
  const { resolvedTheme } = useTheme();
  const { screenToFlowPosition, addNodes } = useReactFlow();

  // Allow dropping onto the pane — without preventDefault the browser blocks it.
  const onDragOver = useCallback((event: DragEvent): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Turn a Node Library drop into a fresh instance at the cursor's flow position.
  const onDrop = useCallback(
    (event: DragEvent): void => {
      event.preventDefault();
      const type = getDraggedNodeType(event);
      if (!type) {
        return;
      }
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNodes(createNode(type, position));
    },
    [screenToFlowPosition, addNodes],
  );

  return (
    <ReactFlow
      colorMode={resolvedTheme}
      nodeTypes={nodeTypes}
      defaultNodes={[...defaultNodes]}
      defaultEdges={[]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      panOnScroll
      zoomOnScroll={false}
      zoomOnPinch
      minZoom={0.25}
      maxZoom={2}
      fitView
      proOptions={{ hideAttribution: true }}
      aria-label="Workflow canvas"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={GRID_UNIT}
        size={1}
        color="var(--canvas-dot)"
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

/**
 * The Workflow Builder canvas (spec §04). An infinite canvas with the Figma input
 * model — two-finger scroll pans, ⌘/pinch zooms — a dotted grid, and zoom/fit
 * controls. Node *types* come from the registry via `nodeTypes`; dragging a node
 * from the Node Library drops a new instance at the cursor (data seeded from the
 * registry). Connections and node configuration are out of scope here.
 *
 * Owns its own `ReactFlowProvider` so the drop handler can use `useReactFlow`
 * without the surrounding page having to know about React Flow internals.
 *
 * Theming is automatic: `colorMode` follows the app theme and React Flow's CSS
 * variables are mapped onto our semantic tokens in `globals.css`, so the grid,
 * controls, and ports are correct in both light and dark.
 */
export function WorkflowCanvas({ defaultNodes = [] }: WorkflowCanvasProps): ReactNode {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner defaultNodes={defaultNodes} />
    </ReactFlowProvider>
  );
}
