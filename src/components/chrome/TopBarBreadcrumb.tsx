import { Buildings, CaretUpDown, Globe } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { WORKSPACE_ORGS, WORKSPACE_PROJECTS } from "../../data/mockWorkspace";
import type { Screen, TabId } from "../../types";

type CrumbMenu = "org" | "project" | null;

function getCurrentPageLabel(screen: Screen, activeTab: TabId): string {
  if (screen === "playground") return "Playground";
  if (screen === "tool-catalog") return "Tool Catalog";
  if (screen === "agent-detail") return "Agent Detail";
  if (screen === "empty") return "Dashboard";

  const tabLabels: Record<TabId, string> = {
    dashboard: "Dashboard",
    flows: "Agents",
    runs: "Runs & Traces",
    "tool-calls": "Tool Calls",
    users: "Users & Access",
    auth: "Authentication",
    team: "Team",
    policies: "Policies",
    audit: "Audit Logs",
    usage: "Usage",
  };

  return tabLabels[activeTab];
}

function CrumbDropdown({
  open,
  items,
  activeId,
  onSelect,
  onClose,
}: {
  open: boolean;
  items: Array<{ id: string; label: string }>;
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={menuRef} className="top-bar-crumb-menu" role="listbox">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="option"
          aria-selected={item.id === activeId}
          className={clsx(
            "top-bar-crumb-menu-item",
            item.id === activeId && "top-bar-crumb-menu-item-active",
          )}
          onClick={() => {
            onSelect(item.id);
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TopBarBreadcrumb() {
  const {
    screen,
    activeTab,
    organizationName,
    projectName,
    setOrganizationName,
    setProjectName,
    setScreen,
    setActiveTab,
  } = useApp();

  const [openMenu, setOpenMenu] = useState<CrumbMenu>(null);
  const [activeOrgId, setActiveOrgId] = useState("org-sambit");
  const [activeProjectId, setActiveProjectId] = useState("proj-default");

  const currentPage = getCurrentPageLabel(screen, activeTab);

  const projectOptions = useMemo(
    () => WORKSPACE_PROJECTS.filter((project) => project.orgId === activeOrgId),
    [activeOrgId],
  );

  useEffect(() => {
    if (!projectOptions.some((project) => project.id === activeProjectId)) {
      const fallback = projectOptions[0];
      if (fallback) {
        setActiveProjectId(fallback.id);
        setProjectName(fallback.name);
      }
    }
  }, [activeProjectId, projectOptions, setProjectName]);

  const handleOrgSelect = (orgId: string) => {
    const org = WORKSPACE_ORGS.find((item) => item.id === orgId);
    if (!org) return;

    setActiveOrgId(orgId);
    setOrganizationName(org.name);

    const nextProject = WORKSPACE_PROJECTS.find((project) => project.orgId === orgId);
    if (nextProject) {
      setActiveProjectId(nextProject.id);
      setProjectName(nextProject.name);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = WORKSPACE_PROJECTS.find((item) => item.id === projectId);
    if (!project) return;

    setActiveProjectId(projectId);
    setProjectName(project.name);
    setScreen("active");
    setActiveTab("dashboard");
  };

  return (
    <nav className="top-bar-breadcrumb" aria-label="Breadcrumb">
      <div className="top-bar-crumb-menu-wrap">
        <button
          type="button"
          className="top-bar-crumb top-bar-crumb-select"
          aria-haspopup="listbox"
          aria-expanded={openMenu === "org"}
          onClick={() => setOpenMenu((current) => (current === "org" ? null : "org"))}
        >
          <span className="top-bar-crumb-icon top-bar-crumb-icon-org" aria-hidden>
            <Globe size={11} weight="fill" />
          </span>
          <span className="top-bar-crumb-label">{organizationName}</span>
          <CaretUpDown size={12} weight="bold" className="top-bar-crumb-caret" aria-hidden />
        </button>

        <CrumbDropdown
          open={openMenu === "org"}
          items={WORKSPACE_ORGS.map((org) => ({ id: org.id, label: org.name }))}
          activeId={activeOrgId}
          onSelect={handleOrgSelect}
          onClose={() => setOpenMenu(null)}
        />
      </div>

      <span className="top-bar-crumb-sep" aria-hidden>
        /
      </span>

      <div className="top-bar-crumb-menu-wrap">
        <button
          type="button"
          className="top-bar-crumb top-bar-crumb-select"
          aria-haspopup="listbox"
          aria-expanded={openMenu === "project"}
          onClick={() => setOpenMenu((current) => (current === "project" ? null : "project"))}
        >
          <span className="top-bar-crumb-icon top-bar-crumb-icon-project" aria-hidden>
            <Buildings size={11} weight="fill" />
          </span>
          <span className="top-bar-crumb-label">{projectName}</span>
          <CaretUpDown size={12} weight="bold" className="top-bar-crumb-caret" aria-hidden />
        </button>

        <CrumbDropdown
          open={openMenu === "project"}
          items={projectOptions.map((project) => ({ id: project.id, label: project.name }))}
          activeId={activeProjectId}
          onSelect={handleProjectSelect}
          onClose={() => setOpenMenu(null)}
        />
      </div>

      <span className="top-bar-crumb-sep" aria-hidden>
        /
      </span>

      <span className="top-bar-crumb top-bar-crumb-current" aria-current="page">
        <span className="top-bar-crumb-label">{currentPage}</span>
      </span>
    </nav>
  );
}
