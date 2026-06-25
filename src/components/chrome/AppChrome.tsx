import {
  Bell,
  CaretUpDown,
  Clock,
  Gear,
  Hash,
  House,
  MagnifyingGlass,
  MapTrifold,
  Plus,
  Question,
  Sidebar,
  Sparkle,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { Icon } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { useApp } from "../../context/AppContext";
import { useCommandPalette } from "../../context/CommandPaletteContext";
import type { SidebarViewport } from "../../hooks/useSidebar";
import type { Screen, TabId } from "../../types";
import profileAvatar from "../../assets/profile-avatar.png";
import { ArcadeLogo } from "./ArcadeLogo";
import { TopBarBreadcrumb } from "./TopBarBreadcrumb";

type NavTarget =
  | { kind: "tab"; tab: TabId }
  | { kind: "screen"; screen: Screen };

type NavLink = {
  id: string;
  label: string;
  icon: Icon;
  target: NavTarget;
  primary?: boolean;
};

const PRIMARY_NAV: NavLink[] = [
  {
    id: "home",
    label: "Dashboard",
    icon: House,
    target: { kind: "tab", tab: "dashboard" },
    primary: true,
  },
  {
    id: "playground-top",
    label: "Playground",
    icon: Sparkle,
    target: { kind: "screen", screen: "playground" },
  },
  {
    id: "tool-catalog",
    label: "Tool catalog",
    icon: MagnifyingGlass,
    target: { kind: "screen", screen: "tool-catalog" },
  },
];

const BUILD_NAV: NavLink[] = [
  {
    id: "agents",
    label: "Agents",
    icon: Hash,
    target: { kind: "tab", tab: "flows" },
  },
  {
    id: "tools",
    label: "Tools",
    icon: Clock,
    target: { kind: "screen", screen: "tool-catalog" },
  },
];

const DEPLOY_NAV: NavLink[] = [
  {
    id: "users-access",
    label: "Users and Access",
    icon: Hash,
    target: { kind: "tab", tab: "users" },
  },
  {
    id: "policies",
    label: "Policies",
    icon: Clock,
    target: { kind: "tab", tab: "policies" },
  },
  {
    id: "connections",
    label: "Connections",
    icon: MapTrifold,
    target: { kind: "tab", tab: "auth" },
  },
];

const GOVERN_NAV: NavLink[] = [
  {
    id: "runs",
    label: "Runs",
    icon: Hash,
    target: { kind: "tab", tab: "runs" },
  },
  {
    id: "logs",
    label: "Logs",
    icon: Clock,
    target: { kind: "tab", tab: "tool-calls" },
  },
  {
    id: "audits",
    label: "Audits",
    icon: MapTrifold,
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
  if (target.tab === "dashboard") {
    return (screen === "active" || screen === "empty") && activeTab === "dashboard";
  }
  return screen === "active" && activeTab === target.tab;
}

function NavLinkButton({
  link,
  active,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  onNavigate: (target: NavTarget) => void;
}) {
  const IconComponent = link.icon;

  return (
    <button
      type="button"
      className={clsx(
        "nav-item",
        link.primary && "nav-item-primary",
        active && "nav-item-active",
        active && link.primary && "nav-item-active-primary",
      )}
      onClick={() => onNavigate(link.target)}
    >
      <IconComponent size={16} weight={active ? "fill" : "regular"} />
      <span className="nav-item-label">{link.label}</span>
    </button>
  );
}

function NavSection({
  title,
  links,
  screen,
  activeTab,
  onNavigate,
}: {
  title: string;
  links: NavLink[];
  screen: Screen;
  activeTab: TabId;
  onNavigate: (target: NavTarget) => void;
}) {
  return (
    <div className="nav-section">
      <div className="nav-section-label">{title}</div>
      {links.map((link) => (
        <NavLinkButton
          key={link.id}
          link={link}
          active={isTargetActive(link.target, screen, activeTab)}
          onNavigate={onNavigate}
        />
      ))}
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
        <div className="nav-primary">
          {PRIMARY_NAV.map((link) => (
            <NavLinkButton
              key={link.id}
              link={link}
              active={isTargetActive(link.target, screen, activeTab)}
              onNavigate={navigate}
            />
          ))}
        </div>

        <NavSection
          title="Build"
          links={BUILD_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />

        <NavSection
          title="Deploy"
          links={DEPLOY_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />

        <NavSection
          title="Govern"
          links={GOVERN_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />
      </div>

      <div className="nav-footer">
        <button type="button" className="nav-item">
          <Gear size={16} weight="regular" />
          <span className="nav-item-label">Settings</span>
        </button>
        <button type="button" className="nav-item">
          <Question size={16} weight="regular" />
          <span className="nav-item-label">Documentation</span>
        </button>
        <button type="button" className="nav-user" aria-label="Account menu">
          <img src={profileAvatar} alt="Sambit Nayak" className="nav-user-avatar" />
          <div className="nav-user-info">
            <span className="nav-user-name">Sambit Nayak</span>
            <span className="nav-user-email">sam@example.com</span>
          </div>
          <CaretUpDown size={14} weight="bold" className="nav-user-caret" />
        </button>
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
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  sidebarCollapsed?: boolean;
  sidebarViewport?: SidebarViewport;
}) {
  const { setScreen } = useApp();

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
      <div className="top-bar-cms-inner">
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

          <div className="top-bar-divider" aria-hidden />

          <TopBarBreadcrumb />
        </div>

        <div className="top-bar-cms-right">
          <button type="button" className="top-bar-icon-btn" aria-label="Notifications">
            <Bell size={18} weight="regular" />
          </button>
          <button type="button" className="btn btn-primary top-bar-cta" onClick={() => setScreen("playground")}>
            <Plus size={16} weight="bold" aria-hidden />
            <span>Create an agent flow</span>
          </button>
        </div>
      </div>
    </header>
  );
}
