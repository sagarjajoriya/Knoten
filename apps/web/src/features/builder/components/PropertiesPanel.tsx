import { useNodes, useReactFlow } from '@xyflow/react';
import { type ReactNode } from 'react';

import { useWorkflowHistory } from '../history/history-context';
import { NODE_CATEGORIES } from '../nodes/categories';
import { getNodeDefinition } from '../nodes/registry';
import { type BaseNodeData, type KnotenNode } from '../nodes/types';

import { PropertyField, TextInput } from './properties/PropertyField';

import { cn } from '@/lib/cn';

function PanelShell({ children }: { readonly children: ReactNode }): ReactNode {
  return (
    <aside
      className="border-line bg-surface flex h-full w-80 flex-none flex-col border-l"
      aria-label="Properties"
    >
      {children}
    </aside>
  );
}

/**
 * Properties Panel (spec §04 · inspector). Tracks the single selected node from
 * the shared React Flow store and renders its editor dynamically: a shared Name
 * field (every node has a label) followed by the node type's own editor from the
 * registry. Edits flow straight back to the canvas via `updateNodeData`, so the
 * card updates as you type.
 */
export function PropertiesPanel(): ReactNode {
  const nodes = useNodes<KnotenNode>();
  const { updateNodeData } = useReactFlow<KnotenNode>();
  const { takeSnapshot } = useWorkflowHistory();

  const selected = nodes.find((node) => node.selected);

  if (!selected) {
    return (
      <PanelShell>
        <div className="text-ink-3 flex flex-1 items-center justify-center px-6 text-center text-sm">
          Select a node to edit its properties.
        </div>
      </PanelShell>
    );
  }

  const definition = getNodeDefinition(selected.type ?? '');

  if (!definition) {
    return (
      <PanelShell>
        <div className="text-ink-3 flex flex-1 items-center justify-center px-6 text-center text-sm">
          No editor is registered for “{selected.type}”.
        </div>
      </PanelShell>
    );
  }

  const Icon = definition.icon;
  const Editor = definition.propertiesEditor;

  const updateData = (patch: Partial<BaseNodeData>): void => {
    // Coalesce a burst of edits to the same node+field into one undo entry.
    takeSnapshot(`property:${selected.id}:${Object.keys(patch).sort().join(',')}`);
    updateNodeData(selected.id, patch);
  };

  return (
    <PanelShell>
      <header className="border-line flex items-center gap-2.5 border-b px-4 py-3">
        <span
          className={cn(
            'rounded-input flex h-7 w-7 flex-none items-center justify-center',
            NODE_CATEGORIES[definition.category].tileClass,
          )}
        >
          <Icon width={15} height={15} />
        </span>
        <span className="min-w-0">
          <span className="text-ink block truncate text-sm font-semibold leading-tight">
            {definition.label}
          </span>
          <span className="text-ink-3 block truncate font-mono text-[10px] leading-tight">
            {definition.type}
          </span>
        </span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <PropertyField label="Name" htmlFor="node-name">
          <TextInput
            id="node-name"
            value={selected.data.label}
            onChange={(event) => {
              updateData({ label: event.target.value });
            }}
          />
        </PropertyField>

        <Editor data={selected.data} updateData={updateData} />
      </div>
    </PanelShell>
  );
}
