import clsx from "clsx";
import type { ProjectHealth, TabId } from "../../types";
import { StatusBadge } from "../primitives/StatusBadge";

export function ProjectSummaryPanel({
  health,
  isEmpty,
  onSelectTab,
  compact,
}: {
  health: ProjectHealth;
  isEmpty?: boolean;
  onSelectTab?: (tab: TabId) => void;
  compact?: boolean;
}) {
  const items = [
    { label: "Status", value: <StatusBadge status={health.status} small /> },
    { label: "Active flows", value: health.activeFlows },
    { label: "Connected tools", value: health.connectedTools },
    { label: "Users enabled", value: health.usersEnabled },
    { label: "Last run", value: health.lastRun },
    { label: "Environment", value: health.environment },
  ];

  const showActions = !isEmpty && onSelectTab;
  const actions = showActions ? (
    <div className={clsx("project-summary-actions", compact && "project-summary-actions-inline")}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => onSelectTab("tool-calls")}
      >
        Logs
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => onSelectTab("audit")}
      >
        Audits
      </button>
    </div>
  ) : null;

  return (
    <div className={clsx("project-summary dashboard-card", compact && "project-summary-compact")}>
      <div className="dashboard-card-head">
        <h3>{isEmpty ? "No agent flows yet" : "Project summary"}</h3>
        {compact && actions}
      </div>
      {isEmpty && (
        <p className="summary-desc">
          Arcade helps agents securely use tools, ask for authorization, execute actions,
          and log every step.
        </p>
      )}
      <dl className="summary-grid">
        {items.map((item) => (
          <div key={item.label} className="summary-item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      {!compact && actions}
    </div>
  );
}
