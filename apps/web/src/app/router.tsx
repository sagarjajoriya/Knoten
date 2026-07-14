import { type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

/**
 * Central route table. Feature routes will be registered here as they are
 * built, keeping navigation declarative and discoverable in one place.
 */
export function AppRouter(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<HomePlaceholder />} />
    </Routes>
  );
}

function HomePlaceholder(): ReactNode {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 p-8">
      <h1 className="text-2xl font-semibold">Knoten Workflow Builder</h1>
      <p className="text-sm text-gray-500">Monorepo scaffolding is ready.</p>
    </main>
  );
}
