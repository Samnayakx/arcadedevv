import { ArrowRight } from "@phosphor-icons/react";
import type { AttentionItem, Severity } from "../../types";

const SEVERITY_ORDER: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const SEVERITY_LABEL: Record<Severity, string> = {
  high: "Critical",
  medium: "Medium",
  low: "Low",
};

function sortItems(items: AttentionItem[]) {
  return [...items].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

export function NeedsAttentionCards({
  items,
  onOpenAgent,
}: {
  items: AttentionItem[];
  onOpenAgent?: (flowId: string) => void;
}) {
  const sorted = sortItems(items);

  return (
    <div className="needs-attention-inbox dashboard-card dashboard-card-fill">
      <div className="dashboard-card-head">
        <div>
          <h3>Needs attention</h3>
          <p className="needs-attention-subtitle">
            Blockers ranked by urgency
          </p>
        </div>
        {items.length > 0 && (
          <span className="dashboard-card-meta">{items.length} open</span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="dashboard-empty-copy">No open issues. Execution health looks clear.</p>
      ) : (
        <div className="needs-attention-table-wrap">
          <table className="needs-attention-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Impact</th>
                <th>Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr key={item.id}>
                  <td className="needs-attention-issue-cell">
                    <span className="needs-attention-urgency">
                      {SEVERITY_LABEL[item.severity]}
                    </span>
                    <button
                      type="button"
                      className="needs-attention-issue-btn"
                      onClick={() => onOpenAgent?.(item.flowId)}
                    >
                      {item.issue}
                    </button>
                  </td>
                  <td className="needs-attention-impact-cell">{item.impact}</td>
                  <td className="needs-attention-agent-cell">
                    <button
                      type="button"
                      className="needs-attention-agent-link"
                      onClick={() => onOpenAgent?.(item.flowId)}
                    >
                      {item.affectedFlow}
                    </button>
                  </td>
                  <td className="needs-attention-action-cell">
                    <button
                      type="button"
                      className="agent-cards-action-btn"
                      onClick={() => onOpenAgent?.(item.flowId)}
                    >
                      {item.nextAction}
                      <ArrowRight size={14} weight="bold" aria-hidden />
                    </button>
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
