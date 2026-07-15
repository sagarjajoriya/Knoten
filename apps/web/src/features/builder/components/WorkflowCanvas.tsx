import { Background, BackgroundVariant, Controls, ReactFlow } from '@xyflow/react';
import { type ReactNode } from 'react';

import '@xyflow/react/dist/style.css';

import { useTheme } from '@/app/theme/useTheme';

// 16px = one canvas grid unit (spec §15 · the 4px spacing scale, `p-4`).
const GRID_UNIT = 16;

/**
 * The Workflow Builder canvas (spec §04). An empty infinite canvas with the
 * Figma input model — two-finger scroll pans, ⌘/pinch zooms — a dotted grid, and
 * zoom/fit controls. Nodes, wires, and selection are intentionally out of scope
 * here; this establishes the surface they will render onto.
 *
 * Theming is automatic: `colorMode` follows the app theme and the React Flow CSS
 * variables are mapped onto our semantic tokens in `globals.css`, so the grid and
 * controls are correct in both light and dark.
 */
export function WorkflowCanvas(): ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <ReactFlow
      colorMode={resolvedTheme}
      nodes={[]}
      edges={[]}
      panOnScroll
      zoomOnScroll={false}
      zoomOnPinch
      minZoom={0.25}
      maxZoom={2}
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
