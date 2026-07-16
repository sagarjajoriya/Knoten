import { ok, type Result, type WorkflowDocument } from '@knoten/shared';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

import { type KnotenNode } from '../nodes/types';

import { deserializeWorkflow, serializeWorkflow } from './workflow-io';
import { toReactFlowGraph, toWorkflowDocument, type WorkflowMetadata } from './workflow-mapper';

export interface WorkflowPersistence {
  /** Snapshot the current editor state as a domain document. */
  readonly save: () => WorkflowDocument;
  /** Snapshot and serialize the current editor state to JSON. */
  readonly serialize: () => string;
  /** Validate JSON and apply it to the canvas; returns the loaded document. */
  readonly load: (json: string) => Result<WorkflowDocument, string>;
}

/**
 * Bridges the pure persistence layer to React Flow's store: reads the graph via
 * `toObject()` for saving, and writes nodes/edges/viewport back for loading. This
 * is the only persistence module aware of React Flow — the domain model, mappers,
 * and JSON I/O all stay framework-agnostic. Must run inside a `ReactFlowProvider`.
 */
export function useWorkflowPersistence(metadata: WorkflowMetadata): WorkflowPersistence {
  const { toObject, setNodes, setEdges, setViewport } = useReactFlow<KnotenNode>();

  const save = useCallback((): WorkflowDocument => {
    const { nodes, edges, viewport } = toObject();
    return toWorkflowDocument(metadata, { nodes, edges, viewport });
  }, [toObject, metadata]);

  const serialize = useCallback((): string => serializeWorkflow(save()), [save]);

  const load = useCallback(
    (json: string): Result<WorkflowDocument, string> => {
      const parsed = deserializeWorkflow(json);
      if (!parsed.ok) {
        return parsed;
      }
      const graph = toReactFlowGraph(parsed.value);
      setNodes(graph.nodes);
      setEdges(graph.edges);
      // setViewport returns a transition promise we don't need to await.
      void setViewport(graph.viewport);
      return ok(parsed.value);
    },
    [setNodes, setEdges, setViewport],
  );

  return { save, serialize, load };
}
