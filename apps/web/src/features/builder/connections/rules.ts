import { type Connection, type Edge } from '@xyflow/react';

/** The current graph a candidate connection is validated against. */
export interface ConnectionContext {
  readonly edges: readonly Edge[];
}

/**
 * A single connection-validation rule. Returns `true` if the connection is
 * allowed. Rules are ANDed together, so each one only vetoes what it cares about
 * and stays ignorant of the others.
 */
export type ConnectionRule = (connection: Connection | Edge, context: ConnectionContext) => boolean;

/** Reject connecting a node to itself. */
export const rejectSelfConnection: ConnectionRule = (connection) =>
  connection.source !== connection.target;

/** Reject a second edge between the same source-handle / target-handle pair. */
export const rejectDuplicateConnection: ConnectionRule = (connection, { edges }) =>
  !edges.some(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target &&
      (edge.sourceHandle ?? null) === (connection.sourceHandle ?? null) &&
      (edge.targetHandle ?? null) === (connection.targetHandle ?? null),
  );

/**
 * The active rule set. Add future rules — max connections per handle, port type
 * compatibility, and so on — to this array and every consumer picks them up.
 */
export const connectionRules: readonly ConnectionRule[] = [
  rejectSelfConnection,
  rejectDuplicateConnection,
];

/** True only when every rule allows the connection. */
export function isConnectionAllowed(
  connection: Connection | Edge,
  context: ConnectionContext,
): boolean {
  return connectionRules.every((rule) => rule(connection, context));
}
