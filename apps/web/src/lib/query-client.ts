import { QueryClient } from '@tanstack/react-query';

/**
 * Factory for the app-wide TanStack Query client. Exposed as a factory so
 * tests can spin up an isolated client per case.
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
