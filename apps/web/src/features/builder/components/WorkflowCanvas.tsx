import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useReactFlow,
  type Connection,
  type Edge,
} from '@xyflow/react';
import { useCallback, useRef, type DragEvent, type ReactNode } from 'react';

import '@xyflow/react/dist/style.css';

import { isConnectionAllowed } from '../connections/rules';
import { useWorkflowHistory, type GraphSnapshot } from '../history/history-context';
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

/**
 * The Workflow Builder canvas (spec §04). An infinite canvas with the Figma input
 * model — two-finger scroll pans, ⌘/pinch zooms — a dotted grid, and zoom/fit
 * controls. Node *types* come from the registry via `nodeTypes`; dragging a node
 * from the Node Library drops a new instance at the cursor (data seeded from the
 * registry). Clicking a node selects exactly one (multi-select is disabled) and
 * the selected node is highlighted by its own card. Dragging between handles
 * connects compatible nodes — `isValidConnection` gates the drag (no self- or
 * duplicate connections); a selected wire highlights and Backspace deletes it.
 *
 * Must render inside a `ReactFlowProvider` (owned by the page) so the canvas and
 * the Properties Panel share one node and edge store.
 *
 * Theming is automatic: `colorMode` follows the app theme and React Flow's CSS
 * variables are mapped onto our semantic tokens in `globals.css`.
 */
export function WorkflowCanvas({ defaultNodes = [] }: WorkflowCanvasProps): ReactNode {
  const { resolvedTheme } = useTheme();
  const { screenToFlowPosition, addNodes, getEdges } = useReactFlow();
  const { takeSnapshot, captureGraph, pushSnapshot } = useWorkflowHistory();

  // The extensible gate for connections: React Flow runs this during the connect
  // drag (visual valid/invalid feedback) and again before committing the edge.
  const isValidConnection = useCallback(
    (connection: Connection | Edge): boolean =>
      isConnectionAllowed(connection, { edges: getEdges() }),
    [getEdges],
  );

  // Node move: snapshot the pre-move graph when a drag begins.
  const onNodeDragStart = useCallback((): void => {
    takeSnapshot();
  }, [takeSnapshot]);

  // Delete fires onEdgesDelete then onNodesDelete (before the store is mutated).
  // Batch them into one checkpoint per delete operation via a microtask flag.
  const deleteBatching = useRef(false);
  const snapshotDeletion = useCallback((): void => {
    if (deleteBatching.current) {
      return;
    }
    deleteBatching.current = true;
    takeSnapshot();
    queueMicrotask(() => {
      deleteBatching.current = false;
    });
  }, [takeSnapshot]);

  // Connect: the edge is auto-added *before* onConnect fires, so capture the
  // pre-connect graph at drag start and commit it only if an edge is made.
  const pendingConnect = useRef<GraphSnapshot | null>(null);
  const onConnectStart = useCallback((): void => {
    pendingConnect.current = captureGraph();
  }, [captureGraph]);
  const onConnect = useCallback((): void => {
    if (pendingConnect.current) {
      pushSnapshot(pendingConnect.current);
      pendingConnect.current = null;
    }
  }, [pushSnapshot]);
  const onConnectEnd = useCallback((): void => {
    pendingConnect.current = null;
  }, []);

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
      takeSnapshot();
      addNodes(createNode(type, position));
    },
    [screenToFlowPosition, addNodes, takeSnapshot],
  );

  return (
    <ReactFlow
      colorMode={resolvedTheme}
      nodeTypes={nodeTypes}
      defaultNodes={[...defaultNodes]}
      defaultEdges={[]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeDragStart={onNodeDragStart}
      onNodesDelete={snapshotDeletion}
      onEdgesDelete={snapshotDeletion}
      onConnectStart={onConnectStart}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      isValidConnection={isValidConnection}
      multiSelectionKeyCode={null}
      selectionKeyCode={null}
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
