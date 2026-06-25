import { DataTable } from "../primitives/DataTable";
import type { AttentionItem } from "../../types";

export function NeedsAttentionTable({
  items,
  onOpenAgent,
}: {
  items: AttentionItem[];
  onOpenAgent?: (flowId: string) => void;
}) {
  return (
    <div className="needs-attention">
      <div className="dashboard-card-head">
        <h3>Needs attention</h3>
        {items.length > 0 && (
          <span className="dashboard-card-meta">{items.length} open</span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="dashboard-empty-copy">No open issues. Execution health looks clear.</p>
      ) : (
        <DataTable
          columns={[
            {
              key: "issue",
              label: "Issue",
              className: "needs-attention-issue",
            },
            {
              key: "severity",
              label: "Severity",
              className: "needs-attention-severity",
              render: (row) => (
                <span className={`severity severity-${row.severity}`}>{row.severity}</span>
              ),
            },
            {
              key: "affectedFlow",
              label: "Affected agent",
              className: "needs-attention-agent",
              render: (row) =>
                onOpenAgent ? (
                  <button
                    type="button"
                    className="needs-attention-link"
                    onClick={() => onOpenAgent(row.flowId)}
                  >
                    {row.affectedFlow}
                  </button>
                ) : (
                  row.affectedFlow
                ),
            },
            {
              key: "category",
              label: "Category",
              className: "needs-attention-meta",
            },
            {
              key: "impact",
              label: "Impact",
              className: "needs-attention-meta",
            },
            {
              key: "nextAction",
              label: "Next action",
              className: "needs-attention-action",
              render: (row) => (
                <button type="button" className="needs-attention-link">
                  {row.nextAction}
                </button>
              ),
            },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}
