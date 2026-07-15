import { createContext } from 'react';

/**
 * `system` follows the OS via `prefers-color-scheme`; `light`/`dark` are explicit
 * user choices that win over the OS (spec §10). The resolved value is what the UI
 * actually renders after `system` is evaluated against the media query.
 */
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly resolvedTheme: ResolvedTheme;
  readonly setTheme: (theme: Theme) => void;
  readonly toggle: () => void;
}

export const THEME_STORAGE_KEY = 'knoten-theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Reflects the chosen theme onto `<html data-theme>`. `system` removes the
 * attribute so the CSS `prefers-color-scheme` rules take over.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
