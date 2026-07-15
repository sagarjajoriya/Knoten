import { type ReactNode, type SVGProps } from 'react';

/**
 * One drawn icon family (spec §18): 24px grid, 1.5px stroke, rounded caps and
 * joins, rendered at 20px in navigation. Icons are decorative by default
 * (`aria-hidden`) — callers provide the accessible label on the control.
 */
export type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps): ReactNode {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export type IconComponent = (props: IconProps) => ReactNode;

export const HomeIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M3 10.5 12 4l9 6.5" />
    <path d="M5 9.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M10 20v-5h4v5" />
  </Icon>
);

export const WorkflowIcon: IconComponent = (props) => (
  <Icon {...props}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="12" r="2" />
    <path d="M6 8v8" />
    <path d="M8 6h6a2 2 0 0 1 2 2v2" />
    <path d="M16 14v0a2 2 0 0 1-2 2H8" />
  </Icon>
);

export const RunsIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M3 12h4l2-6 4 12 2-6h4" />
  </Icon>
);

export const ConnectionsIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M9 15 15 9" />
    <path d="M10.5 6.5 12 5a4 4 0 0 1 6 6l-1.5 1.5" />
    <path d="M13.5 17.5 12 19a4 4 0 0 1-6-6l1.5-1.5" />
  </Icon>
);

export const DataStoreIcon: IconComponent = (props) => (
  <Icon {...props}>
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
  </Icon>
);

export const TemplatesIcon: IconComponent = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Icon>
);

export const MembersIcon: IconComponent = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6" />
    <path d="M17.5 14.3A5.5 5.5 0 0 1 20.5 20" />
  </Icon>
);

export const SettingsIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M4 7h9" />
    <path d="M17 7h3" />
    <path d="M4 12h3" />
    <path d="M11 12h9" />
    <path d="M4 17h9" />
    <path d="M17 17h3" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="15" cy="17" r="2" />
  </Icon>
);

export const SearchIcon: IconComponent = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const PlusIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

export const MenuIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </Icon>
);

export const CloseIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M6 6 18 18" />
    <path d="M18 6 6 18" />
  </Icon>
);

export const SidebarToggleIcon: IconComponent = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </Icon>
);

export const SunIcon: IconComponent = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4 12H2" />
    <path d="M22 12h-2" />
    <path d="m5 5 1.5 1.5" />
    <path d="M17.5 17.5 19 19" />
    <path d="M19 5l-1.5 1.5" />
    <path d="M6.5 17.5 5 19" />
  </Icon>
);

export const MoonIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Icon>
);

export const ArrowUpIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M12 19V5" />
    <path d="m6 11 6-6 6 6" />
  </Icon>
);

export const ArrowDownIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </Icon>
);

export const MinusIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);

export const CheckIcon: IconComponent = (props) => (
  <Icon {...props}>
    <path d="m5 12.5 5 5L19.5 7" />
  </Icon>
);
