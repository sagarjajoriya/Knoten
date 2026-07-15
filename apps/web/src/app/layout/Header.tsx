import { type ReactNode, type RefObject } from 'react';
import { Link } from 'react-router-dom';

import { workspacePath } from './navigation';
import { ThemeToggle } from './ThemeToggle';

import { MenuIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

interface HeaderProps {
  readonly workspace: string;
  readonly sectionLabel: string;
  readonly menuButtonRef: RefObject<HTMLButtonElement | null>;
  readonly onOpenMobileNav: () => void;
}

/**
 * Top bar (spec §02 · Breadcrumb): menu trigger on small screens, breadcrumb,
 * the command-palette search entry, and workspace-level actions. The search and
 * "New workflow" controls are chrome only here — behavior arrives with those
 * features, so they are intentionally inert.
 */
export function Header({
  workspace,
  sectionLabel,
  menuButtonRef,
  onOpenMobileNav,
}: HeaderProps): ReactNode {
  return (
    <header className="border-line bg-surface flex h-14 flex-none items-center gap-3 border-b px-4">
      <IconButton
        ref={menuButtonRef}
        label="Open navigation"
        aria-controls="app-sidebar"
        className="lg:hidden"
        onClick={onOpenMobileNav}
      >
        <MenuIcon />
      </IconButton>

      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="text-ink-3 flex items-center gap-2 text-sm">
          <li className="hidden sm:block">
            <Link to={workspacePath(workspace, '')} className="hover:text-ink">
              {workspace}
            </Link>
          </li>
          <li className="hidden sm:block" aria-hidden>
            /
          </li>
          <li className="text-ink truncate font-semibold" aria-current="page">
            {sectionLabel}
          </li>
        </ol>
      </nav>

      <button
        type="button"
        className="rounded-input border-line bg-bg text-ink-3 hover:border-line-strong ml-auto hidden min-w-[200px] items-center gap-2 border px-2.5 py-1.5 text-sm transition-colors sm:flex"
      >
        <SearchIcon width={14} height={14} className="flex-none" />
        <span>Search or jump to…</span>
        <kbd className="border-line bg-surface text-ink-3 ml-auto rounded border border-b-2 px-1.5 font-mono text-xs">
          ⌘K
        </kbd>
      </button>

      <IconButton label="Search" className="ml-auto sm:ml-0 sm:hidden">
        <SearchIcon />
      </IconButton>

      <ThemeToggle />

      <Button variant="primary">
        <PlusIcon width={16} height={16} />
        <span className="hidden sm:inline">New workflow</span>
      </Button>

      <span
        className="bg-accent-soft text-accent-text flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold"
        aria-hidden
      >
        SJ
      </span>
    </header>
  );
}
