import { type ReactNode } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '@/app/layout/AppShell';
import { PlaceholderPage } from '@/app/layout/PlaceholderPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';

const DEFAULT_WORKSPACE = 'acme';

/**
 * Central route table (spec §02 · URL structure). Top-level areas render inside
 * the shared `AppShell`; each currently resolves to a placeholder until its
 * feature is built. Feature routes register here as they land.
 */
export function AppRouter(): ReactNode {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/w/${DEFAULT_WORKSPACE}`} replace />} />

      <Route path="/w/:workspace" element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route
          path="flows"
          element={
            <PlaceholderPage
              title="Workflows"
              description="Every workflow in this workspace, across list, board, and folder views."
            />
          }
        />
        <Route
          path="runs"
          element={
            <PlaceholderPage
              title="Runs"
              description="The workspace run history — filterable, keyboard-navigable, deep-linkable to any step."
            />
          }
        />
        <Route
          path="connections"
          element={
            <PlaceholderPage
              title="Connections"
              description="Authenticated apps and credentials your workflows connect to."
            />
          }
        />
        <Route
          path="data-stores"
          element={
            <PlaceholderPage
              title="Data Stores"
              description="Persistent key–value and table storage shared across workflow runs."
            />
          }
        />
        <Route
          path="templates"
          element={
            <PlaceholderPage
              title="Templates"
              description="Prebuilt workflows to start from and share across the workspace."
            />
          }
        />
        <Route
          path="members"
          element={
            <PlaceholderPage
              title="Members"
              description="People in this workspace and their roles."
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Workspace configuration — each page is individually addressable."
            />
          }
        />
        <Route
          path="settings/:page"
          element={
            <PlaceholderPage
              title="Settings"
              description="Workspace configuration — each page is individually addressable."
            />
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage(): ReactNode {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-ink-3 font-mono text-sm">404</p>
      <h1 className="text-ink text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-ink-2 max-w-sm text-sm">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        to={`/w/${DEFAULT_WORKSPACE}`}
        className="rounded-btn bg-accent text-on-accent hover:bg-accent-hover mt-2 px-3 py-1.5 text-sm font-semibold"
      >
        Back to Home
      </Link>
    </main>
  );
}
