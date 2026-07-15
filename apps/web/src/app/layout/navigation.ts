import {
  ConnectionsIcon,
  DataStoreIcon,
  HomeIcon,
  MembersIcon,
  RunsIcon,
  SettingsIcon,
  TemplatesIcon,
  WorkflowIcon,
  type IconComponent,
} from '@/components/icons';

export interface NavItem {
  readonly label: string;
  /** Path segment appended after `/w/:workspace`. Empty string is the index (Home). */
  readonly segment: string;
  readonly icon: IconComponent;
  /** Match the workspace root exactly rather than as a prefix (Home only). */
  readonly end?: boolean;
}

/** Top-level areas (spec §02 · Global navigation). */
export const primaryNav: readonly NavItem[] = [
  { label: 'Home', segment: '', icon: HomeIcon, end: true },
  { label: 'Workflows', segment: 'flows', icon: WorkflowIcon },
  { label: 'Runs', segment: 'runs', icon: RunsIcon },
  { label: 'Connections', segment: 'connections', icon: ConnectionsIcon },
  { label: 'Data Stores', segment: 'data-stores', icon: DataStoreIcon },
  { label: 'Templates', segment: 'templates', icon: TemplatesIcon },
];

/** Pinned to the bottom of the rail (spec §02). */
export const pinnedNav: readonly NavItem[] = [
  { label: 'Members', segment: 'members', icon: MembersIcon },
  { label: 'Settings', segment: 'settings', icon: SettingsIcon },
];

const allNavItems: readonly NavItem[] = [...primaryNav, ...pinnedNav];

export function workspacePath(workspace: string, segment: string): string {
  const base = `/w/${workspace}`;
  return segment ? `${base}/${segment}` : base;
}

/** Resolve the current section label for the breadcrumb. */
export function activeSectionLabel(pathname: string, workspace: string): string {
  const base = `/w/${workspace}`;
  const rest = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\//, '') : '';
  if (!rest) {
    return 'Home';
  }
  const segment = rest.split('/')[0];
  return allNavItems.find((item) => item.segment === segment)?.label ?? 'Home';
}
