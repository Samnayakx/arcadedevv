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
        <div className="recent-runs-table-wrap">
          <table className="recent-runs-table">
            <thead>
              <tr>
                <th>Run</th>
                <th>Agent</th>
                <th>Tools</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((run) => (
                <tr key={run.id}>
                  <td className="recent-runs-run">
                    <button type="button" className="recent-runs-main" onClick={() => onOpenRun(run.id)}>
                      <span className="recent-runs-name">{run.name}</span>
                      <span className="recent-runs-meta">
                        {run.timestamp} · {run.duration}
                      </span>
                    </button>
                  </td>
                  <td className="recent-runs-agent">
                    {onOpenAgent ? (
                      <button
                        type="button"
                        className="recent-runs-link"
                        onClick={() => onOpenAgent(run.flowId)}
                      >
                        {run.flowName}
                      </button>
                    ) : (
                      run.flowName
                    )}
                  </td>
                  <td className="recent-runs-tools">
                    <AppLogoList apps={run.toolsCalled} />
                  </td>
                  <td className="recent-runs-status">
                    <StatusBadge status={run.status} small />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
