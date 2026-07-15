import { type NodeDefinition } from '../types';

import { httpRequestDefinition } from './http-request';
import { manualTriggerDefinition } from './manual-trigger';

/**
 * The registered node definitions — the single catalog every registry-driven
 * surface reads from. Adding a node type is a two-line change: create its
 * definition file, then add it to this array.
 */
export const nodeDefinitions: readonly NodeDefinition[] = [
  manualTriggerDefinition,
  httpRequestDefinition,
];
