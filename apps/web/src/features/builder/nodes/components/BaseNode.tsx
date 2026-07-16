import { Handle, Position } from '@xyflow/react';
import { type ReactNode } from 'react';

import { NODE_CATEGORIES, type NodeCategory } from '../categories';

import { type IconComponent } from '@/components/icons';
import { cn } from '@/lib/cn';

interface BaseNodeProps {
  readonly icon: IconComponent;
  readonly category: NodeCategory;
  readonly title: string;
  /** Mono technical subtitle (method, path, integration…). */
  readonly subtitle?: string;
  /** Left target port — omit for source-only trigger nodes. */
  readonly hasInput?: boolean;
  /** Right source port — omit for terminal sink nodes. */
  readonly hasOutput?: boolean;
  readonly selected?: boolean;
}

/**
 * The shared node-card shell (spec §04 · Node anatomy): a category-colored icon
 * tile, the editable title, a mono technical subtitle, and ports on the vertical
 * midline. Node components compose this and map their own `data` onto the props,
 * so the card layout and states live in one place.
 */
export function BaseNode({
  icon: Icon,
  category,
  title,
  subtitle,
  hasInput = false,
  hasOutput = false,
  selected = false,
}: BaseNodeProps): ReactNode {
  return (
    <div
      className={cn(
        'rounded-card bg-surface flex w-[190px] items-start gap-2.5 border px-3 py-2.5 transition-shadow',
        selected
          ? 'border-accent ring-accent-soft shadow-e2 ring-[3px]'
          : 'border-line-strong shadow-e1',
      )}
    >
      {hasInput ? <Handle type="target" position={Position.Left} /> : null}

      <span
        className={cn(
          'rounded-input flex h-7 w-7 flex-none items-center justify-center',
          NODE_CATEGORIES[category].tileClass,
        )}
      >
        <Icon width={15} height={15} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="text-ink block truncate text-[11.5px] font-semibold leading-tight">
          {title}
        </span>
        {subtitle ? (
          <span className="text-ink-3 mt-0.5 block truncate font-mono text-[10px] leading-tight">
            {subtitle}
          </span>
        ) : null}
      </span>

      {hasOutput ? <Handle type="source" position={Position.Right} /> : null}
    </div>
  );
}
