import {
  WORKFLOW_SCHEMA_VERSION,
  type NodeKind,
  type WorkflowDocument,
  type WorkflowEdge,
  type WorkflowNode,
} from '@knoten/shared';
import { type Edge, type Viewport } from '@xyflow/react';

import { type NodeCategory } from '../nodes/categories';
import { getNodeDefinition } from '../nodes/registry';
import { type BaseNodeData, type KnotenNode } from '../nodes/types';

/**
 * Editor-held workflow metadata (a subset of the persisted document). Kept
 * separate from the graph so the page can own and restore it independently.
 */
export interface WorkflowMetadata {
  readonly id: string;
  readonly name: string;
  readonly description?: string | undefined;
}

/** The React Flow view of a graph, as returned by `instance.toObject()`. */
export interface ReactFlowGraph {
  readonly nodes: readonly KnotenNode[];
  readonly edges: readonly Edge[];
  readonly viewport: Viewport;
}

// Registry category → coarse semantic role persisted on each node. The registry
// `type` is the precise identity; `kind` is the backend-facing classification.
const CATEGORY_TO_KIND: Record<NodeCategory, NodeKind> = {
  trigger: 'trigger',
  core: 'action',
  flow: 'condition',
  ai: 'action',
  app: 'action',
};

function toWorkflowNode(node: KnotenNode): WorkflowNode {
  const definition = node.type ? getNodeDefinition(node.type) : undefined;
  return {
    id: node.id,
    type: node.type,
    kind: definition ? CATEGORY_TO_KIND[definition.category] : 'action',
    name: node.data.label,
    position: { x: node.position.x, y: node.position.y },
    // Only the node's own config crosses the boundary — never React Flow's
    // per-instance UI state (selected, dragging, measured size, …).
    data: { ...node.data },
  };
}

function toWorkflowEdge(edge: Edge): WorkflowEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
  };
}

/** Map the live React Flow graph + editor metadata into a persistable document. */
export function toWorkflowDocument(
  metadata: WorkflowMetadata,
  graph: ReactFlowGraph,
): WorkflowDocument {
  return {
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    id: metadata.id,
    name: metadata.name,
    description: metadata.description,
    nodes: graph.nodes.map(toWorkflowNode),
    edges: graph.edges.map(toWorkflowEdge),
    viewport: {
      x: graph.viewport.x,
      y: graph.viewport.y,
      zoom: graph.viewport.zoom,
    },
  };
}

function toNodeData(data: Record<string, unknown>): BaseNodeData {
  // Every node needs a label; fall back defensively for hand-authored JSON.
  const label = typeof data.label === 'string' ? data.label : '';
  return { ...data, label };
}

function toReactFlowNode(node: WorkflowNode): KnotenNode {
  return {
    id: node.id,
    type: node.type,
    position: { x: node.position.x, y: node.position.y },
    data: toNodeData(node.data),
  };
}

function toReactFlowEdge(edge: WorkflowEdge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
  };
}

/** Rebuild a React Flow graph (nodes, edges, viewport) from a saved document. */
export function toReactFlowGraph(document: WorkflowDocument): {
  nodes: KnotenNode[];
  edges: Edge[];
  viewport: Viewport;
} {
  return {
    nodes: document.nodes.map(toReactFlowNode),
    edges: document.edges.map(toReactFlowEdge),
    viewport: {
      x: document.viewport.x,
      y: document.viewport.y,
      zoom: document.viewport.zoom,
    },
  };
}
