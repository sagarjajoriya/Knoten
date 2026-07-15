import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import { Header } from './Header';
import { activeSectionLabel } from './navigation';
import { Sidebar } from './Sidebar';

import { useMediaQuery } from '@/lib/useMediaQuery';

const SIDEBAR_COLLAPSED_KEY = 'knoten-sidebar-collapsed';

/**
 * Application chrome shared by every workspace surface: the navigation rail, the
 * top bar, and the routed content region. Owns the responsive rail state
 * (collapsed rail on desktop, off-canvas drawer below it) and the keyboard/focus
 * behavior that goes with it. Business surfaces render through the `<Outlet />`.
 */
export function AppShell(): ReactNode {
  const { workspace = 'acme' } = useParams();
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const [collapsed, setCollapsed] = useState<boolean>(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true',
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleCollapse = useCallback((): void => {
    setCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  const dismissMobileNav = useCallback((): void => {
    setMobileNavOpen(false);
  }, []);

  const openMobileNav = useCallback((): void => {
    setMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback((): void => {
    setMobileNavOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // The rail is always visible on desktop — dismiss the drawer state when we cross up.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = (): void => {
      if (media.matches) {
        setMobileNavOpen(false);
      }
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  // Escape closes the drawer and returns focus to its trigger.
  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeMobileNav();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen, closeMobileNav]);

  const sectionLabel = activeSectionLabel(pathname, workspace);

  return (
    <div className="flex h-full">
      <a
        href="#main-content"
        className="focus:rounded-btn focus:bg-surface focus:text-ink focus:shadow-e2 sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <Sidebar
        workspace={workspace}
        collapsed={collapsed}
        mobileOpen={mobileNavOpen}
        isDesktop={isDesktop}
        onCloseMobile={closeMobileNav}
        onNavigate={dismissMobileNav}
        onToggleCollapse={toggleCollapse}
      />

      {mobileNavOpen && !isDesktop ? (
        <div
          className="bg-ink/30 fixed inset-0 z-40 lg:hidden"
          aria-hidden
          onClick={closeMobileNav}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          workspace={workspace}
          sectionLabel={sectionLabel}
          menuButtonRef={menuButtonRef}
          onOpenMobileNav={openMobileNav}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
