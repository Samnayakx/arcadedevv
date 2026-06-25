import {
  BookOpen,
  CaretDown,
  CaretRight,
  ChartLineUp,
  ClipboardText,
  Bell,
  Command,
  CreditCard,
  Key,
  MagicWand,
  MagnifyingGlass,
  Plugs,
  PlugsConnected,
  ShieldCheck,
  Sidebar,
  SquaresFour,
  UsersThree,
  Wrench,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { Icon } from "@phosphor-icons/react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";
import type { SidebarViewport } from "../../hooks/useSidebar";
import type { Screen, TabId } from "../../types";
import { ArcadeLogo } from "./ArcadeLogo";

type NavTarget =
  | { kind: "tab"; tab: TabId }
  | { kind: "screen"; screen: Screen };

type NavLeaf = {
  id: string;
  label: string;
  target: NavTarget;
  badge?: string;
};

type NavGroup = {
  id: string;
  label: string;
  icon: Icon;
  defaultOpen?: boolean;
  children: NavLeaf[];
};

type NavEntry =
  | { kind: "link"; id: string; label: string; icon: Icon; target: NavTarget; accentActive?: boolean }
  | { kind: "group"; group: NavGroup };

const BUILD_NAV: NavEntry[] = [
  {
    kind: "link",
    id: "agents",
    label: "Agents",
    icon: PlugsConnected,
    target: { kind: "tab", tab: "flows" },
  },
  {
    kind: "link",
    id: "tools",
    label: "Tools",
    icon: Wrench,
    target: { kind: "tab", tab: "tool-calls" },
  },
  {
    kind: "link",
    id: "playground",
    label: "Playground",
    icon: MagicWand,
    target: { kind: "screen", screen: "playground" },
    accentActive: true,
  },
];

const DEPLOY_NAV: NavEntry[] = [
  {
    kind: "link",
    id: "users-access",
    label: "Users & Access",
    icon: UsersThree,
    target: { kind: "tab", tab: "users" },
  },
  {
    kind: "link",
    id: "policies",
    label: "Policies",
    icon: ShieldCheck,
    target: { kind: "tab", tab: "policies" },
  },
  {
    kind: "link",
    id: "connections",
    label: "Connections",
    icon: Plugs,
    target: { kind: "tab", tab: "auth" },
  },
];

const OBSERVE_NAV: NavEntry[] = [
  {
    kind: "link",
    id: "runs",
    label: "Runs",
    icon: ChartLineUp,
    target: { kind: "tab", tab: "runs" },
  },
  {
    kind: "link",
    id: "logs",
    label: "Logs",
    icon: ClipboardText,
    target: { kind: "tab", tab: "tool-calls" },
  },
  {
    kind: "link",
    id: "audit",
    label: "Audit",
    icon: ClipboardText,
    target: { kind: "tab", tab: "audit" },
  },
];

function isTargetActive(
  target: NavTarget,
  screen: Screen,
  activeTab: TabId,
): boolean {
  if (target.kind === "screen") return screen === target.screen;
  if (target.tab === "flows") {
    return (
      (screen === "active" || screen === "agent-detail") &&
      (activeTab === "flows" || screen === "agent-detail")
    );
  }
  return screen === "active" && activeTab === target.tab;
}

function NavCollapsible({
  label,
  icon: IconComponent,
  defaultOpen = true,
  active,
  children,
}: {
  label: string;
  icon: Icon;
  defaultOpen?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="nav-collapsible">
      <button
        type="button"
        className={clsx("nav-item", active && "nav-item-active")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <IconComponent size={16} weight={active ? "fill" : "regular"} />
        <span className="nav-item-label">{label}</span>
        {open ? (
          <CaretDown size={12} className="nav-item-chevron" weight="bold" />
        ) : (
          <CaretRight size={12} className="nav-item-chevron" weight="bold" />
        )}
      </button>
      {open && <ul className="nav-sublist">{children}</ul>}
    </div>
  );
}

function NavSubLink({
  label,
  active,
  badge,
  onClick,
}: {
  label: string;
  active: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <li className="nav-sublist-item">
      <button
        type="button"
        className={clsx("nav-subitem", active && "nav-subitem-active")}
        onClick={onClick}
      >
        <span className="nav-item-label">{label}</span>
        {badge && <span className="nav-badge">{badge}</span>}
      </button>
    </li>
  );
}

function NavSection({
  title,
  entries,
  screen,
  activeTab,
  onNavigate,
}: {
  title: string;
  entries: NavEntry[];
  screen: Screen;
  activeTab: TabId;
  onNavigate: (target: NavTarget) => void;
}) {
  return (
    <div className="nav-section">
      <div className="nav-section-label">{title}</div>
      {entries.map((entry) => {
        if (entry.kind === "link") {
          const IconComponent = entry.icon;
          const active = isTargetActive(entry.target, screen, activeTab);

          return (
            <button
              key={entry.id}
              type="button"
              className={clsx(
                "nav-item",
                active && "nav-item-active",
                active && entry.accentActive && "nav-item-active-accent",
              )}
              onClick={() => onNavigate(entry.target)}
            >
              <IconComponent size={16} weight={active ? "fill" : "regular"} />
              <span className="nav-item-label">{entry.label}</span>
            </button>
          );
        }

        const { group } = entry;
        const groupActive = group.children.some((child) =>
          isTargetActive(child.target, screen, activeTab),
        );

        return (
          <NavCollapsible
            key={group.id}
            label={group.label}
            icon={group.icon}
            defaultOpen={group.defaultOpen}
            active={groupActive}
          >
            {group.children.map((child) => (
              <NavSubLink
                key={child.id}
                label={child.label}
                badge={child.badge}
                active={isTargetActive(child.target, screen, activeTab)}
                onClick={() => onNavigate(child.target)}
              />
            ))}
          </NavCollapsible>
        );
      })}
    </div>
  );
}

export function LeftNav({
  onNavigate,
  onResizeStart,
  canResize,
}: {
  onNavigate?: () => void;
  onResizeStart?: (event: MouseEvent) => void;
  canResize?: boolean;
}) {
  const { screen, setScreen, activeTab, setActiveTab } = useApp();
  const { openPalette } = useCommandPalette();

  const navigate = (target: NavTarget) => {
    if (target.kind === "screen") {
      setScreen(target.screen);
    } else {
      setScreen("active");
      setActiveTab(target.tab);
    }
    onNavigate?.();
  };

  const controlCenterActive =
    (screen === "active" || screen === "empty") && activeTab === "dashboard";

  return (
    <nav className="left-nav">
      <div className="nav-logo">
        <ArcadeLogo />
      </div>

      <button type="button" className="nav-search" aria-label="Quick search" onClick={openPalette}>
        <MagnifyingGlass size={16} weight="regular" />
        <span className="nav-search-placeholder">Quick search...</span>
        <span className="nav-search-kbd">⌘K</span>
      </button>

      <div className="nav-scroll">
        <button
          type="button"
          className={clsx("nav-item nav-item-top", controlCenterActive && "nav-item-active")}
          onClick={() => navigate({ kind: "tab", tab: "dashboard" })}
        >
          <SquaresFour size={16} weight={controlCenterActive ? "fill" : "regular"} />
          <span className="nav-item-label">Control Center</span>
        </button>

        <NavSection
          title="Build"
          entries={BUILD_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />

        <NavSection
          title="Deploy"
          entries={DEPLOY_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />

        <NavSection
          title="Observe"
          entries={OBSERVE_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />
      </div>

      <div className="nav-footer">
        <div className="nav-settings">
          <div className="nav-section-label">Settings</div>
          <button type="button" className="nav-item" onClick={() => navigate({ kind: "tab", tab: "usage" })}>
            <CreditCard size={16} weight="regular" />
            <span className="nav-item-label">Billing</span>
          </button>
          <button type="button" className="nav-item">
            <BookOpen size={16} weight="regular" />
            <span className="nav-item-label">Documentation</span>
          </button>
        </div>
        <button type="button" className="nav-api-key-btn">
          <Key size={16} weight="regular" />
          <span className="nav-api-key-label">Get API key</span>
        </button>
        <div className="nav-user">
          <div className="nav-user-avatar">SN</div>
          <div>
            <div className="nav-user-name">Sambit Nayak</div>
            <div className="nav-user-plan">Hobby Plan</div>
          </div>
        </div>
      </div>

      {canResize && (
        <div
          className="sidebar-resize-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          onMouseDown={onResizeStart}
        />
      )}
    </nav>
  );
}

export function TopBar({
  onToggleSidebar,
  sidebarOpen,
  sidebarCollapsed,
  sidebarViewport,
}: {
  title?: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  sidebarCollapsed?: boolean;
  sidebarViewport?: SidebarViewport;
}) {
  const { setScreen } = useApp();
  const { openPalette } = useCommandPalette();

  const sidebarToggleLabel =
    sidebarViewport === "desktop"
      ? sidebarCollapsed
        ? "Expand sidebar"
        : "Collapse sidebar"
      : sidebarOpen
        ? "Close sidebar"
        : "Open sidebar";

  return (
    <header className="top-bar top-bar-cms">
      <div className="top-bar-cms-left">
        <button
          type="button"
          className="top-bar-sidebar-toggle"
          aria-label={sidebarToggleLabel}
          aria-expanded={sidebarViewport === "desktop" ? !sidebarCollapsed : !!sidebarOpen}
          onClick={onToggleSidebar}
        >
          <Sidebar size={18} weight="regular" />
        </button>
      </div>

      <div className="top-bar-cms-right">
        <button type="button" className="top-bar-kbd-btn" aria-label="Command palette" onClick={openPalette}>
          <Command size={14} weight="bold" />
          <span>⌘K</span>
        </button>
        <button type="button" className="top-bar-icon-btn" aria-label="Notifications">
          <Bell size={18} weight="regular" />
        </button>
        <button type="button" className="top-bar-link top-bar-link-cta" onClick={() => setScreen("get-started")}>
          Create an agent flow
        </button>
      </div>
    </header>
  );
}
