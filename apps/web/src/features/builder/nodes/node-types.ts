import { type NodeTypes } from '@xyflow/react';

import { nodeDefinitions } from './definitions';

/**
 * React Flow `nodeTypes` map, derived from the registry. This is the only place
 * the registry meets React Flow's rendering config — the registry itself stays
 * unaware of canvas state. The cast bridges our precisely-typed node components
 * to React Flow's intentionally loose `NodeTypes` signature.
 */
export const nodeTypes: NodeTypes = Object.fromEntries(
  nodeDefinitions.map((definition) => [definition.type, definition.component]),
);
