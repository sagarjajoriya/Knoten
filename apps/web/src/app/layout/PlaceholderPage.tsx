import { type ReactNode } from 'react';

interface PlaceholderPageProps {
  readonly title: string;
  readonly description: string;
}

/**
 * Stand-in content for a routed surface whose feature has not been built yet.
 * Keeps the shell verifiable end-to-end (every rail destination resolves) without
 * introducing any business logic. Feature work replaces these per route.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps): ReactNode {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <h1 className="text-ink text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-ink-2 mt-2 max-w-prose text-sm">{description}</p>
      <div className="rounded-panel border-line bg-surface text-ink-3 shadow-e1 mt-8 border p-8 text-sm">
        This surface hasn’t been built yet.
      </div>
    </section>
  );
}
