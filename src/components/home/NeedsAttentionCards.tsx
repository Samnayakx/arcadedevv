import { ArrowRight } from "@phosphor-icons/react";
import type { AttentionItem, Severity } from "../../types";
import { Btn } from "../primitives/Btn";
import { CardHead } from "../primitives/CardHead";
import { Icon } from "../primitives/Icon";

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
      <CardHead
        title="Needs attention"
        subtitle="Blockers ranked by urgency"
        subtitleClassName="needs-attention-subtitle"
        meta={items.length > 0 ? `${items.length} open` : undefined}
      />

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
                    <Btn
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenAgent?.(item.flowId)}
                    >
                      {item.nextAction}
                      <Icon icon={ArrowRight} size="sm" weight="bold" aria-hidden />
                    </Btn>
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
