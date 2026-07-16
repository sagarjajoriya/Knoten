import { type Edge } from '@xyflow/react';
import { createContext, useContext } from 'react';

import { type KnotenNode } from '../nodes/types';

/**
 * A point-in-time copy of the graph — the unit of undo/redo. Holds only the
 * persistent graph (nodes + edges); transient UI state (selection, dragging) is
 * stripped when a snapshot is captured, so history never records or restores it.
 */
export interface GraphSnapshot {
  readonly nodes: readonly KnotenNode[];
  readonly edges: readonly Edge[];
}

export interface WorkflowHistory {
  /**
   * Push the current graph as an undo checkpoint, to be called *before* a
   * mutation. Pass a coalesce key to merge a rapid burst of same-key changes
   * (e.g. typing in one field) into a single entry.
   */
  readonly takeSnapshot: (coalesceKey?: string) => void;
  /** Capture the current graph without pushing it — for deferred commits. */
  readonly captureGraph: () => GraphSnapshot;
  /** Push a previously captured graph as an undo checkpoint. */
  readonly pushSnapshot: (snapshot: GraphSnapshot) => void;
  readonly undo: () => void;
  readonly redo: () => void;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export const WorkflowHistoryContext = createContext<WorkflowHistory | null>(null);

export function useWorkflowHistory(): WorkflowHistory {
  const context = useContext(WorkflowHistoryContext);
  if (!context) {
    throw new Error('useWorkflowHistory must be used within a WorkflowHistoryProvider.');
  }
  return context;
}
