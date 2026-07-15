import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { createQueryClient } from '@/lib/query-client';

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Composes the global providers (routing + server-state) around the app tree.
 * Keeping this in one place makes the composition root explicit and testable.
 */
export function AppProviders({ children }: AppProvidersProps): ReactNode {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
