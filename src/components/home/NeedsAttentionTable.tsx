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
            { key: "issue", label: "Issue" },
            {
              key: "severity",
              label: "Severity",
              render: (row) => (
                <span className={`severity severity-${row.severity}`}>{row.severity}</span>
              ),
            },
            { key: "affectedFlow", label: "Affected agent", render: (row) => (
              onOpenAgent ? (
                <button type="button" className="table-action" onClick={() => onOpenAgent(row.flowId)}>
                  {row.affectedFlow}
                </button>
              ) : (
                row.affectedFlow
              )
            ) },
            { key: "category", label: "Category" },
            { key: "impact", label: "Impact" },
            {
              key: "nextAction",
              label: "Next action",
              render: (row) => (
                <button type="button" className="table-action">{row.nextAction}</button>
              ),
            },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}
