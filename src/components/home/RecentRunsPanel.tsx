import type { Run } from "../../types";
import { AppLogoList } from "../primitives/AppChip";
import { StatusBadge } from "../primitives/StatusBadge";

export function RecentRunsPanel({
  runs,
  onOpenRun,
  onOpenAgent,
}: {
  runs: Run[];
  onOpenRun: (runId: string) => void;
  onOpenAgent?: (flowId: string) => void;
}) {
  const recent = runs.slice(0, 6);

  return (
    <div className="recent-runs dashboard-card dashboard-card-fill">
      <div className="dashboard-card-head">
        <h3>Recent runs</h3>
        {recent.length > 0 && (
          <span className="dashboard-card-meta">{recent.length} latest</span>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="dashboard-empty-copy">Runs will appear here after your first agent action.</p>
      ) : (
        <ul className="recent-runs-list">
          {recent.map((run) => (
            <li key={run.id} className="recent-runs-item">
              <button type="button" className="recent-runs-main" onClick={() => onOpenRun(run.id)}>
                <span className="recent-runs-name">{run.name}</span>
                <span className="recent-runs-meta">
                  {run.timestamp} · {run.duration}
                </span>
              </button>
              <button
                type="button"
                className="table-action"
                onClick={() => onOpenAgent?.(run.flowId)}
              >
                {run.flowName}
              </button>
              <AppLogoList apps={run.toolsCalled} />
              <StatusBadge status={run.status} small />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
