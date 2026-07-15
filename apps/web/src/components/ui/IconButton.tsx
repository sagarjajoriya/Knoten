import { type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';

import { cn } from '@/lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required — icon-only controls must expose an accessible name (spec §20). */
  readonly label: string;
  readonly ref?: Ref<HTMLButtonElement>;
}

/**
 * Square, icon-only control. The visible child is decorative; `label` supplies
 * the accessible name and native tooltip.
 */
export function IconButton({
  label,
  className,
  type = 'button',
  children,
  ref,
  ...props
}: IconButtonProps): ReactNode {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'rounded-btn text-ink-2 inline-flex h-8 w-8 items-center justify-center',
        'hover:bg-surface-2 hover:text-ink transition-colors duration-100',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
