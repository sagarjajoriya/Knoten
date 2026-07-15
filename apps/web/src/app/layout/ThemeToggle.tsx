import { type ReactNode } from 'react';

import { useTheme } from '@/app/theme/useTheme';
import { MoonIcon, SunIcon } from '@/components/icons';
import { IconButton } from '@/components/ui/IconButton';

/**
 * Toggles between light and dark (the "Toggle theme" action, spec §02). The icon
 * shows the theme you'd switch *to*; the label names the action for assistive tech.
 */
export function ThemeToggle(): ReactNode {
  const { resolvedTheme, toggle } = useTheme();
  const nextIsDark = resolvedTheme === 'light';

  return (
    <IconButton
      label={nextIsDark ? 'Switch to dark theme' : 'Switch to light theme'}
      onClick={toggle}
    >
      {nextIsDark ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
}
