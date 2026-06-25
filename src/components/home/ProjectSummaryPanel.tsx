import type { ProjectHealth } from "../../types";
import { StatusBadge } from "../primitives/StatusBadge";

export function ProjectSummaryPanel({ health, isEmpty }: { health: ProjectHealth; isEmpty?: boolean }) {
  const items = [
    { label: "Status", value: <StatusBadge status={health.status} small /> },
    { label: "Active flows", value: health.activeFlows },
    { label: "Connected tools", value: health.connectedTools },
    { label: "Users enabled", value: health.usersEnabled },
    { label: "Last run", value: health.lastRun },
    { label: "Environment", value: health.environment },
  ];

  return (
    <div className="project-summary dashboard-card">
      <div className="dashboard-card-head">
        <h3>{isEmpty ? "No agent flows yet" : "Project summary"}</h3>
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
    </div>
  );
}
