import {
  Bell,
  CaretUpDown,
  ChartBar,
  Check,
  ClipboardText,
  Gear,
  HardDrives,
  House,
  Key,
  MagnifyingGlass,
  Pulse,
  Question,
  Robot,
  ShieldCheck,
  Sidebar,
  Sparkle,
  Users,
  UsersThree,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { Icon } from "@phosphor-icons/react";
import { useState, type MouseEvent } from "react";
import { useApp } from "../../context/AppContext";
import { API_KEY_PLACEHOLDER } from "../../data/mockProject";
import { useCommandPalette } from "../../context/CommandPaletteContext";
import type { SidebarViewport } from "../../hooks/useSidebar";
import type { Screen, TabId } from "../../types";
import profileAvatar from "../../assets/profile-avatar.png";
import { ArcadeLogo } from "./ArcadeLogo";
import { TopBarBreadcrumb } from "./TopBarBreadcrumb";
import { Btn } from "../primitives/Btn";
import { Icon as UiIcon } from "../primitives/Icon";

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
];

const BUILD_NAV: NavLink[] = [
  {
    id: "playground",
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
  {
    id: "agents",
    label: "Agents",
    icon: Robot,
    target: { kind: "tab", tab: "flows" },
  },
];

const ROLLOUT_NAV: NavLink[] = [
  {
    id: "servers",
    label: "Servers",
    icon: HardDrives,
    target: { kind: "screen", screen: "gateway" },
  },
  {
    id: "users-access",
    label: "Users & Access",
    icon: Users,
    target: { kind: "tab", tab: "users" },
  },
  {
    id: "authentication",
    label: "Authentication",
    icon: Key,
    target: { kind: "tab", tab: "auth" },
  },
  {
    id: "team",
    label: "Team",
    icon: UsersThree,
    target: { kind: "tab", tab: "team" },
  },
  {
    id: "policies",
    label: "Policies",
    icon: ShieldCheck,
    target: { kind: "tab", tab: "policies" },
  },
];

const OBSERVE_NAV: NavLink[] = [
  {
    id: "runs-traces",
    label: "Runs & Traces",
    icon: Pulse,
    target: { kind: "tab", tab: "runs" },
  },
  {
    id: "audit-logs",
    label: "Audit Logs",
    icon: ClipboardText,
    target: { kind: "tab", tab: "audit" },
  },
  {
    id: "usage",
    label: "Usage",
    icon: ChartBar,
    target: { kind: "tab", tab: "usage" },
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
  const { screen, setScreen, activeTab, setActiveTab, markSetupStep } = useApp();
  const { openPalette } = useCommandPalette();
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleGetApiKey = async () => {
    try {
      await navigator.clipboard.writeText(API_KEY_PLACEHOLDER);
    } catch {
      // Clipboard may be unavailable — still advance setup state.
    }
    markSetupStep("api_key_copied");
    setApiKeyCopied(true);
    window.setTimeout(() => setApiKeyCopied(false), 1800);
  };

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
          title="Roll out"
          links={ROLLOUT_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />

        <NavSection
          title="Observe"
          links={OBSERVE_NAV}
          screen={screen}
          activeTab={activeTab}
          onNavigate={navigate}
        />
      </div>

      <div className="nav-footer">
        <button
          type="button"
          className={clsx("nav-item", "nav-item-key", apiKeyCopied && "nav-item-key-copied")}
          onClick={handleGetApiKey}
        >
          {apiKeyCopied ? (
            <Check size={16} weight="bold" />
          ) : (
            <Key size={16} weight="regular" />
          )}
          <span className="nav-item-label">{apiKeyCopied ? "API key copied" : "Get API key"}</span>
        </button>
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
  const { setScreen, screen } = useApp();

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
          <Btn
            type="button"
            variant="icon"
            size="sm"
            className="top-bar-sidebar-toggle"
            aria-label={sidebarToggleLabel}
            aria-expanded={sidebarViewport === "desktop" ? !sidebarCollapsed : !!sidebarOpen}
            onClick={onToggleSidebar}
          >
            <UiIcon icon={Sidebar} size="lg" />
          </Btn>

          <div className="top-bar-divider" aria-hidden />

          <TopBarBreadcrumb />
        </div>

        <div className="top-bar-cms-right">
          <Btn type="button" variant="icon" size="sm" className="top-bar-icon-btn" aria-label="Notifications">
            <UiIcon icon={Bell} size="lg" />
          </Btn>
          <Btn
            type="button"
            variant={screen === "playground" ? "secondary" : "primary"}
            size="md"
            className="top-bar-cta"
            onClick={() => setScreen("playground")}
          >
            <UiIcon icon={Sparkle} size="md" weight="bold" aria-hidden />
            <span>Build</span>
          </Btn>
        </div>
      </div>
    </header>
  );
}
