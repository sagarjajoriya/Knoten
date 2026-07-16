import { useMemo, useState, type ReactNode } from 'react';

import { NODE_CATEGORIES } from '../nodes/categories';
import { setNodeDragData } from '../nodes/dnd';
import { getNodeDefinitionsByCategory } from '../nodes/registry';
import { type NodeDefinition } from '../nodes/types';

import { SearchIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

function matchesQuery(definition: NodeDefinition, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }
  return (
    definition.label.toLowerCase().includes(normalized) ||
    definition.description.toLowerCase().includes(normalized)
  );
}

/**
 * Node Library (spec §05). Lists every available node straight from the registry,
 * grouped by category — there is no hardcoded catalog. A plain substring filter
 * stands in for the eventual semantic search; ranking, inline docs, and wire-drag
 * compatibility filtering land in later slices.
 */
export function NodeLibrary(): ReactNode {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => getNodeDefinitionsByCategory(), []);

  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          definitions: group.definitions.filter((definition) => matchesQuery(definition, query)),
        }))
        .filter((group) => group.definitions.length > 0),
    [groups, query],
  );

  return (
    <aside
      className="border-line bg-surface flex h-full w-72 flex-none flex-col border-r"
      aria-label="Node library"
    >
      <div className="p-3">
        <div className="rounded-input border-line bg-bg focus-within:border-accent flex items-center gap-2 border px-2.5 py-1.5">
          <SearchIcon width={14} height={14} className="text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search nodes…"
            aria-label="Search nodes"
            className="text-ink placeholder:text-ink-3 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-3">
        {visibleGroups.length === 0 ? (
          <p className="text-ink-3 px-4 py-6 text-sm">No nodes match “{query.trim()}”.</p>
        ) : (
          visibleGroups.map((group) => (
            <section key={group.category}>
              <h3 className="text-ink-3 px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider">
                {NODE_CATEGORIES[group.category].label}
              </h3>
              <ul>
                {group.definitions.map((definition) => {
                  const Icon = definition.icon;
                  return (
                    <li
                      key={definition.type}
                      draggable
                      onDragStart={(event) => {
                        setNodeDragData(event, definition.type);
                      }}
                      title={`Drag “${definition.label}” onto the canvas`}
                      className="hover:bg-surface-2 flex cursor-grab items-center gap-2.5 px-3 py-1.5 active:cursor-grabbing"
                    >
                      <span
                        className={cn(
                          'rounded-input flex h-6 w-6 flex-none items-center justify-center',
                          NODE_CATEGORIES[definition.category].tileClass,
                        )}
                      >
                        <Icon width={13} height={13} />
                      </span>
                      <span className="min-w-0">
                        <span className="text-ink block text-[12px] font-semibold leading-tight">
                          {definition.label}
                        </span>
                        <span className="text-ink-3 block truncate text-[11px] leading-tight">
                          {definition.description}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
