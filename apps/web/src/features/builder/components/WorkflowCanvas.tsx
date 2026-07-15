import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import { type ReactNode } from 'react';

import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes/node-types';
import { type KnotenNode } from '../nodes/types';

import { useTheme } from '@/app/theme/useTheme';

// 16px = one canvas grid unit (spec §15 · the 4px spacing scale, `p-4`).
const GRID_UNIT = 16;

interface WorkflowCanvasProps {
  /** Nodes to seed the uncontrolled canvas with on mount. */
  readonly defaultNodes?: readonly KnotenNode[];
}

/**
 * The Workflow Builder canvas (spec §04). An infinite canvas with the Figma input
 * model — two-finger scroll pans, ⌘/pinch zooms — a dotted grid, and zoom/fit
 * controls. Node *types* come from the registry via `nodeTypes`; graph state,
 * connections, and node insertion are out of scope here.
 *
 * Theming is automatic: `colorMode` follows the app theme and React Flow's CSS
 * variables are mapped onto our semantic tokens in `globals.css`, so the grid,
 * controls, and ports are correct in both light and dark.
 */
export function WorkflowCanvas({ defaultNodes = [] }: WorkflowCanvasProps): ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <ReactFlow
      colorMode={resolvedTheme}
      nodeTypes={nodeTypes}
      defaultNodes={[...defaultNodes]}
      defaultEdges={[]}
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
