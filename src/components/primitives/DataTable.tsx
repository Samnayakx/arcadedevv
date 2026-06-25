import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  mono?: boolean;
  className?: string;
  headerClassName?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowAction,
  actionLabel = "View",
}: {
  columns: Column<T>[];
  rows: T[];
  onRowAction?: (row: T) => void;
  actionLabel?: string;
}) {
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.headerClassName}>{col.label}</th>
            ))}
            {onRowAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={[col.mono ? "mono" : undefined, col.className].filter(Boolean).join(" ") || undefined}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? "—")}
                </td>
              ))}
              {onRowAction && (
                <td>
                  <button
                    type="button"
                    className="table-action"
                    onClick={() => onRowAction(row)}
                  >
                    {actionLabel}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
