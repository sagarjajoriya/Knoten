import { useEffect, useRef, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { Logo } from './Logo';
import { pinnedNav, primaryNav, workspacePath, type NavItem } from './navigation';

import { CloseIcon, SidebarToggleIcon } from '@/components/icons';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/lib/cn';

interface SidebarProps {
  readonly workspace: string;
  /** Collapsed to an icon rail (desktop preference only). */
  readonly collapsed: boolean;
  /** Off-canvas drawer is open (below the desktop breakpoint). */
  readonly mobileOpen: boolean;
  readonly isDesktop: boolean;
  /** Dismiss the drawer and return focus to its trigger (close button, Esc). */
  readonly onCloseMobile: () => void;
  /** Dismiss the drawer without stealing focus (a nav link took over). */
  readonly onNavigate: () => void;
  readonly onToggleCollapse: () => void;
}

/**
 * Global navigation rail (spec §02). Full 240px rail on desktop with an optional
 * 56px collapsed state; below the desktop breakpoint it becomes an off-canvas
 * drawer. Active state, theming, and focus are all token- and semantics-driven.
 */
export function Sidebar({
  workspace,
  collapsed,
  mobileOpen,
  isDesktop,
  onCloseMobile,
  onNavigate,
  onToggleCollapse,
}: SidebarProps): ReactNode {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // When the drawer opens, move focus into it so keyboard users land in the nav.
  useEffect(() => {
    if (mobileOpen && !isDesktop) {
      closeButtonRef.current?.focus();
    }
  }, [mobileOpen, isDesktop]);

  // Off-canvas and not open → remove from the tab order entirely.
  const inert = !isDesktop && !mobileOpen;

  return (
    <aside
      id="app-sidebar"
      inert={inert || undefined}
      aria-label="Sidebar"
      className={cn(
        'border-line bg-surface fixed inset-y-0 left-0 z-50 flex w-60 flex-col gap-4 border-r p-4',
        'transition-transform duration-200 ease-out',
        'lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]',
        mobileOpen ? 'shadow-e3 translate-x-0' : '-translate-x-full',
        collapsed ? 'lg:w-14 lg:px-2' : 'lg:w-60',
      )}
    >
      <div className="flex items-center justify-between">
        <Logo markOnly={collapsed} />
        <IconButton
          ref={closeButtonRef}
          label="Close navigation"
          className="lg:hidden"
          onClick={onCloseMobile}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <nav aria-label="Primary" className="flex flex-1 flex-col">
        <ul className="flex flex-col gap-px">
          {primaryNav.map((item) => (
            <RailLink
              key={item.segment || 'home'}
              item={item}
              workspace={workspace}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        <div className="flex-1" />

        <ul className="border-line flex flex-col gap-px border-t pt-2">
          {pinnedNav.map((item) => (
            <RailLink
              key={item.segment}
              item={item}
              workspace={workspace}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      <div className="hidden lg:flex lg:justify-end">
        <IconButton
          label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
          onClick={onToggleCollapse}
        >
          <SidebarToggleIcon />
        </IconButton>
      </div>
    </aside>
  );
}

interface RailLinkProps {
  readonly item: NavItem;
  readonly workspace: string;
  readonly collapsed: boolean;
  readonly onNavigate: () => void;
}

function RailLink({ item, workspace, collapsed, onNavigate }: RailLinkProps): ReactNode {
  const { icon: Icon, label } = item;

  return (
    <li>
      <NavLink
        to={workspacePath(workspace, item.segment)}
        end={item.end ?? false}
        title={collapsed ? label : undefined}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-100',
            collapsed && 'lg:justify-center lg:px-0',
            isActive
              ? 'bg-accent-soft text-accent-text'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
          )
        }
      >
        <Icon className="flex-none" aria-hidden />
        <span className={cn(collapsed && 'lg:sr-only')}>{label}</span>
      </NavLink>
    </li>
  );
}
