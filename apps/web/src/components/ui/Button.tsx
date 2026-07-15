import { type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  // One primary per view (spec §14) — accent ground, on-accent label.
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-surface-2',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
};

/**
 * Text button matching the spec's `.ui-btn` (§14). Everything but the single
 * primary action per view should use `secondary` or `ghost`.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={cn(
        'rounded-btn inline-flex items-center whitespace-nowrap font-semibold',
        'transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
