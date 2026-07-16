import { useReactFlow } from '@xyflow/react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { type KnotenNode } from '../nodes/types';

import {
  WorkflowHistoryContext,
  type GraphSnapshot,
  type WorkflowHistory,
} from './history-context';

// Cap the stacks so history stays bounded on long editing sessions.
const MAX_HISTORY = 100;
// Same-key snapshots within this window collapse into one entry (e.g. typing).
const COALESCE_WINDOW_MS = 500;

interface WorkflowHistoryProviderProps {
  readonly children: ReactNode;
}

/**
 * Undo/redo for the workflow graph. Integrates with the React Flow store (the
 * workflow's single source of truth): it reads the current graph to snapshot and
 * writes whole graphs back to undo/redo. A `past`/`future` stack of immutable
 * snapshots keeps this O(1) per operation and independent of *which* action ran —
 * every action just calls `takeSnapshot()` before mutating.
 *
 * Stacks live in refs (mutating them must not re-render); only the `canUndo` /
 * `canRedo` booleans are React state, and they update only when they actually
 * flip. Must render inside a `ReactFlowProvider`.
 */
export function WorkflowHistoryProvider({ children }: WorkflowHistoryProviderProps): ReactNode {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow<KnotenNode>();

  const past = useRef<GraphSnapshot[]>([]);
  const future = useRef<GraphSnapshot[]>([]);
  const coalesce = useRef<{ key: string; time: number } | null>(null);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

  const syncFlags = useCallback((): void => {
    setFlags((prev) => {
      const canUndo = past.current.length > 0;
      const canRedo = future.current.length > 0;
      return prev.canUndo === canUndo && prev.canRedo === canRedo ? prev : { canUndo, canRedo };
    });
  }, []);

  // Snapshot = persistent graph only; strip transient per-instance UI state.
  const captureGraph = useCallback(
    (): GraphSnapshot => ({
      nodes: getNodes().map((node) => ({ ...node, selected: false, dragging: false })),
      edges: getEdges().map((edge) => ({ ...edge, selected: false })),
    }),
    [getNodes, getEdges],
  );

  const commit = useCallback(
    (snapshot: GraphSnapshot): void => {
      past.current.push(snapshot);
      if (past.current.length > MAX_HISTORY) {
        past.current.shift();
      }
      future.current = [];
      syncFlags();
    },
    [syncFlags],
  );

  const takeSnapshot = useCallback(
    (coalesceKey?: string): void => {
      const now = Date.now();
      const active = coalesce.current;
      if (
        coalesceKey != null &&
        active !== null &&
        active.key === coalesceKey &&
        now - active.time < COALESCE_WINDOW_MS
      ) {
        // The checkpoint for this burst already exists; just extend the window.
        active.time = now;
        return;
      }
      commit(captureGraph());
      coalesce.current = coalesceKey != null ? { key: coalesceKey, time: now } : null;
    },
    [captureGraph, commit],
  );

  const pushSnapshot = useCallback(
    (snapshot: GraphSnapshot): void => {
      commit(snapshot);
      coalesce.current = null;
    },
    [commit],
  );

  const applyGraph = useCallback(
    (snapshot: GraphSnapshot): void => {
      setNodes([...snapshot.nodes]);
      setEdges([...snapshot.edges]);
    },
    [setNodes, setEdges],
  );

  const undo = useCallback((): void => {
    const previous = past.current.pop();
    if (!previous) {
      return;
    }
    future.current.push(captureGraph());
    coalesce.current = null;
    applyGraph(previous);
    syncFlags();
  }, [captureGraph, applyGraph, syncFlags]);

  const redo = useCallback((): void => {
    const next = future.current.pop();
    if (!next) {
      return;
    }
    past.current.push(captureGraph());
    coalesce.current = null;
    applyGraph(next);
    syncFlags();
  }, [captureGraph, applyGraph, syncFlags]);

  // ⌘/Ctrl+Z undo · ⌘/Ctrl+Shift+Z redo. Skip while editing a form control so
  // the browser's native text undo still works there.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target !== null &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      event.preventDefault();
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [undo, redo]);

  const value = useMemo<WorkflowHistory>(
    () => ({
      takeSnapshot,
      captureGraph,
      pushSnapshot,
      undo,
      redo,
      canUndo: flags.canUndo,
      canRedo: flags.canRedo,
    }),
    [takeSnapshot, captureGraph, pushSnapshot, undo, redo, flags.canUndo, flags.canRedo],
  );

  return (
    <WorkflowHistoryContext.Provider value={value}>{children}</WorkflowHistoryContext.Provider>
  );
}
