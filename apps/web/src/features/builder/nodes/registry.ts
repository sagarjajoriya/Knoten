import { NODE_CATEGORY_ORDER, type NodeCategory } from './categories';
import { nodeDefinitions } from './definitions';
import { type KnotenNode, type NodeDefinition } from './types';

const registryByType: ReadonlyMap<string, NodeDefinition> = new Map(
  nodeDefinitions.map((definition) => [definition.type, definition]),
);

/** Every registered node definition, in registration order. */
export function getAllNodeDefinitions(): readonly NodeDefinition[] {
  return nodeDefinitions;
}

/** Look up a single definition by its node-type id. */
export function getNodeDefinition(type: string): NodeDefinition | undefined {
  return registryByType.get(type);
}

export interface NodeCategoryGroup {
  readonly category: NodeCategory;
  readonly definitions: readonly NodeDefinition[];
}

/** Definitions grouped by category in taxonomy order; empty categories omitted. */
export function getNodeDefinitionsByCategory(): readonly NodeCategoryGroup[] {
  return NODE_CATEGORY_ORDER.map((category) => ({
    category,
    definitions: nodeDefinitions.filter((definition) => definition.category === category),
  })).filter((group) => group.definitions.length > 0);
}

let instanceCount = 0;

/**
 * Build a React Flow node instance from a registered definition, seeding it with
 * a copy of the definition's default data. Independent of any store — the caller
 * decides where the returned node lives.
 */
export function createNode(
  type: string,
  position: { readonly x: number; readonly y: number },
  id?: string,
): KnotenNode {
  const definition = getNodeDefinition(type);
  if (!definition) {
    throw new Error(`Unknown node type: "${type}".`);
  }
  instanceCount += 1;
  return {
    id: id ?? `${type}-${String(instanceCount)}`,
    type,
    position: { x: position.x, y: position.y },
    data: { ...definition.defaultData },
  };
}
