/**
 * Node taxonomy (spec §05 · "Taxonomy & ranking"). Category drives the icon-tile
 * color and the grouping order in the Node Library. The tile colors follow the
 * spec's deliberate mapping — Triggers amber, Apps green — a documented use of the
 * status palette for node identity, not decoration.
 */
export type NodeCategory = 'trigger' | 'core' | 'flow' | 'ai' | 'app';

export interface NodeCategoryMeta {
  readonly id: NodeCategory;
  /** Section heading shown in the library. */
  readonly label: string;
  /** Icon-tile color utilities (ground + foreground). */
  readonly tileClass: string;
}

export const NODE_CATEGORIES: Record<NodeCategory, NodeCategoryMeta> = {
  trigger: { id: 'trigger', label: 'Triggers', tileClass: 'bg-warn-soft text-warn' },
  core: { id: 'core', label: 'Core', tileClass: 'bg-accent-soft text-accent-text' },
  flow: { id: 'flow', label: 'Flow', tileClass: 'bg-accent-soft text-accent-text' },
  ai: { id: 'ai', label: 'AI', tileClass: 'bg-accent-soft text-accent-text' },
  app: { id: 'app', label: 'Apps', tileClass: 'bg-ok-soft text-ok' },
};

/** Category display order for the library. */
export const NODE_CATEGORY_ORDER: readonly NodeCategory[] = [
  'trigger',
  'core',
  'flow',
  'ai',
  'app',
];
