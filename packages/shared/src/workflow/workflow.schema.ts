import { z } from 'zod';

/**
 * Domain contracts for a workflow graph. These Zod schemas are the single
 * source of truth: the API validates against them and the web client infers
 * its types from them, so the two can never drift.
 *
 * This slice covers the *structure* of a workflow. Graph-integrity rules
 * (unique node ids, edges referencing existing nodes) are intentionally a
 * separate concern and will be added on top of these object schemas.
 */

/** The role a node plays in a workflow. */
export const nodeKindSchema = z.enum(['trigger', 'action', 'condition']);
export type NodeKind = z.infer<typeof nodeKindSchema>;

/** A point on the canvas, in flow coordinates. */
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Position = z.infer<typeof positionSchema>;

/** A single node placed on the canvas. */
export const workflowNodeSchema = z.object({
  id: z.string().min(1),
  kind: nodeKindSchema,
  /**
   * The concrete node-type id (e.g. `manual-trigger`, `http-request`) that
   * identifies which implementation renders and runs this node. `kind` is the
   * coarse semantic role; `type` is the specific implementation. Optional so
   * older/hand-authored graphs still validate.
   */
  type: z.string().min(1).optional(),
  name: z.string().min(1).max(120),
  position: positionSchema,
  /** Node-type-specific configuration; refined per kind in a later slice. */
  data: z.record(z.string(), z.unknown()),
});
export type WorkflowNode = z.infer<typeof workflowNodeSchema>;

/** A directed connection from one node's output to another node's input. */
export const workflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().min(1).optional(),
  targetHandle: z.string().min(1).optional(),
});
export type WorkflowEdge = z.infer<typeof workflowEdgeSchema>;

/** A complete workflow graph and its metadata. */
export const workflowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
});
export type Workflow = z.infer<typeof workflowSchema>;

/** The saved camera position of the editor canvas, in flow coordinates. */
export const workflowViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().positive(),
});
export type WorkflowViewport = z.infer<typeof workflowViewportSchema>;

/**
 * Schema version of the persisted document. Bump when the JSON shape changes so
 * loaders (and the backend) can migrate older documents deliberately.
 */
export const WORKFLOW_SCHEMA_VERSION = 1 as const;

/**
 * The full editor document that round-trips to JSON: the workflow (metadata,
 * nodes, edges) plus editor-restorable view state (viewport) and a schema
 * version. This is the exact structure the editor saves and, later, sends to
 * the backend — it carries no React Flow or other UI-runtime state.
 */
export const workflowDocumentSchema = workflowSchema.extend({
  schemaVersion: z.literal(WORKFLOW_SCHEMA_VERSION),
  viewport: workflowViewportSchema,
});
export type WorkflowDocument = z.infer<typeof workflowDocumentSchema>;
