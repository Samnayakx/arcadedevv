import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUpDown,
  Eye,
  Play,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { BrandLogo } from "../primitives/BrandLogo";
import { Btn } from "../primitives/Btn";
import { Icon } from "../primitives/Icon";
import type { CatalogTool } from "../../data/catalogTools";

type SortKey = "name" | "description" | "paramCount";
type SortDir = "asc" | "desc";

const PAGE_SIZES = [10, 20, 50] as const;

export function CatalogToolTable({
  tools,
  app,
}: {
  tools: CatalogTool[];
  app: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);

  const sorted = useMemo(() => {
    const copy = [...tools];
    copy.sort((a, b) => {
      const left = sortKey === "paramCount" ? a.paramCount : a[sortKey].toLowerCase();
      const right = sortKey === "paramCount" ? b.paramCount : b[sortKey].toLowerCase();
      if (left < right) return sortDir === "asc" ? -1 : 1;
      if (left > right) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [tools, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [currentPage, pageSize, sorted]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value as (typeof PAGE_SIZES)[number]);
    setPage(1);
  };

  return (
    <div className="catalog-tool-table">
      <div className="catalog-tool-table-wrap">
        <table className="catalog-tool-table-grid">
          <thead>
            <tr>
              <SortHeader label="Name" active={sortKey === "name"} onClick={() => handleSort("name")} />
              <SortHeader
                label="Description"
                active={sortKey === "description"}
                onClick={() => handleSort("description")}
              />
              <SortHeader
                label="Params"
                active={sortKey === "paramCount"}
                onClick={() => handleSort("paramCount")}
                className="catalog-tool-table-col-params"
              />
              <th>Requirements</th>
              <th className="catalog-tool-table-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((tool) => (
              <tr key={tool.id}>
                <td className="mono catalog-tool-table-name">{tool.name}</td>
                <td className="catalog-tool-table-desc">{tool.description}</td>
                <td className="catalog-tool-table-params">
                  <Icon icon={SlidersHorizontal} size="xs" aria-hidden />
                  <span>{tool.paramCount}</span>
                </td>
                <td>
                  <span className="catalog-tool-req">
                    <BrandLogo name={app} size="sm" />
                    <span className="mono">{tool.requirement}</span>
                  </span>
                </td>
                <td>
                  <div className="catalog-tool-actions">
                    <Btn variant="secondary" size="sm">
                      <Icon icon={Eye} size="sm" aria-hidden />
                      View
                    </Btn>
                    <Btn variant="secondary" size="sm">
                      <Icon icon={Play} size="sm" aria-hidden />
                      Execute
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="catalog-tool-table-footer">
        <label className="catalog-tool-page-size">
          <span>Rows per page</span>
          <span className="catalog-tool-page-size-select">
            <select
              value={pageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
              aria-label="Rows per page"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <CaretDown size={12} weight="bold" aria-hidden />
          </span>
        </label>

        <div className="catalog-tool-pagination">
          <span className="catalog-tool-page-label">
            Page {currentPage} of {totalPages}
          </span>
          <div className="catalog-tool-page-btns">
            <button
              type="button"
              className="catalog-tool-page-btn"
              aria-label="First page"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
            >
              <CaretDoubleLeft size={12} weight="bold" />
            </button>
            <button
              type="button"
              className="catalog-tool-page-btn"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <CaretLeft size={12} weight="bold" />
            </button>
            <button
              type="button"
              className="catalog-tool-page-btn"
              aria-label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <CaretRight size={12} weight="bold" />
            </button>
            <button
              type="button"
              className="catalog-tool-page-btn"
              aria-label="Last page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
            >
              <CaretDoubleRight size={12} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={className}>
      <button
        type="button"
        className={clsx("catalog-tool-sort-btn", active && "catalog-tool-sort-btn-active")}
        onClick={onClick}
      >
        {label}
        <CaretUpDown size={12} weight="bold" aria-hidden />
      </button>
    </th>
  );
}
