import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

// Shared control styling (spec §04 config fields) — token-only, themes automatically.
const controlClass =
  'rounded-input border-line bg-bg text-ink placeholder:text-ink-3 focus:border-accent w-full border px-2.5 py-1.5 text-sm outline-none';

interface PropertyFieldProps {
  readonly label: string;
  readonly htmlFor?: string;
  readonly children: ReactNode;
}

/** A labeled row in the Properties Panel: mono uppercase label above its control. */
export function PropertyField({ label, htmlFor, children }: PropertyFieldProps): ReactNode {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="text-ink-3 block font-mono text-[10px] uppercase tracking-wider"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

/** Token-styled text input for property editors. */
export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>): ReactNode {
  return <input className={cn(controlClass, className)} {...props} />;
}

/** Token-styled select for property editors. */
export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>): ReactNode {
  return (
    <select className={cn(controlClass, className)} {...props}>
      {children}
    </select>
  );
}
