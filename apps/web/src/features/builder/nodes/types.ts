import { type Node, type NodeProps } from '@xyflow/react';
import { type ReactNode } from 'react';

import { type NodeCategory } from './categories';

import { type IconComponent } from '@/components/icons';

/**
 * Base shape every node's `data` extends. `label` is the instance title shown on
 * the card (user-editable later); concrete nodes add their own typed config.
 * Declared as a `type` (not an `interface`) because React Flow constrains node
 * data to `Record<string, unknown>`, which only a type alias satisfies via its
 * implicit index signature.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseNodeData = {
  readonly label: string;
};

/** A React Flow node specialized to our data shapes. */
export type KnotenNode<TData extends BaseNodeData = BaseNodeData> = Node<TData>;

/** Props a node's render component receives from React Flow. */
export type NodeComponentProps<TData extends BaseNodeData = BaseNodeData> = NodeProps<
  KnotenNode<TData>
>;

/** The React component that draws a node on the canvas. */
export type NodeComponent<TData extends BaseNodeData = BaseNodeData> = (
  props: NodeComponentProps<TData>,
) => ReactNode;

/** Props a node's Properties Panel editor receives. */
export interface NodePropertiesEditorProps<TData extends BaseNodeData = BaseNodeData> {
  /** The selected node's current data. */
  readonly data: TData;
  /** Merge a partial patch into the node's data — reflects on the canvas at once. */
  readonly updateData: (patch: Partial<TData>) => void;
}

/** The form a node type renders in the Properties Panel to edit its config. */
export type NodePropertiesEditor<TData extends BaseNodeData = BaseNodeData> = (
  props: NodePropertiesEditorProps<TData>,
) => ReactNode;

/**
 * A single entry in the Node Registry — everything the app needs to list a node
 * in the library, render it on the canvas, and edit it in the Properties Panel.
 * Pure static metadata: it holds no React Flow *state* (no nodes/edges arrays, no
 * store), only the definition.
 */
export interface NodeDefinition<TData extends BaseNodeData = BaseNodeData> {
  /** Unique node-type id; also the key React Flow uses in `nodeTypes`. */
  readonly type: string;
  /** Human name shown in the library and as the default card title. */
  readonly label: string;
  readonly category: NodeCategory;
  readonly icon: IconComponent;
  /** One-line capability description for the library. */
  readonly description: string;
  /** Initial `data` written onto a new instance of this node. */
  readonly defaultData: TData;
  /** Component React Flow uses to render instances of this node. */
  readonly component: NodeComponent<TData>;
  /** Form the Properties Panel renders to edit a selected instance's data. */
  readonly propertiesEditor: NodePropertiesEditor<TData>;
}

/**
 * Identity helper that type-checks a definition against its own data shape at the
 * point of declaration, then erases the data generic for storage in the
 * heterogeneous registry. The single cast here is the standard boundary for a
 * collection of differently-typed definitions (TS has no existential types):
 * authors keep full type safety, while callers read a uniform `NodeDefinition`.
 */
export function defineNode<TData extends BaseNodeData>(
  definition: NodeDefinition<TData>,
): NodeDefinition {
  return definition as unknown as NodeDefinition;
}
