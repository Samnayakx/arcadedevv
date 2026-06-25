import { MagnifyingGlass } from "@phosphor-icons/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { BrandLogo } from "../primitives/BrandLogo";
import {
  getPlaygroundToolCounts,
  PLAYGROUND_TOOLS,
} from "../../data/mockPlayground";

export function PlaygroundToolPanel({
  onSelectTool,
  selectedTool,
}: {
  onSelectTool: (action: string) => void;
  selectedTool: string | null;
}) {
  const [search, setSearch] = useState("");
  const counts = getPlaygroundToolCounts();

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PLAYGROUND_TOOLS.filter((tool) => {
      if (!tool.connected) return false;
      if (!query) return true;
      return (
        tool.action.toLowerCase().includes(query) ||
        tool.app.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      );
    });
  }, [search]);

  return (
    <aside className="playground-tool-panel" aria-label="Connected tools">
      <div className="playground-tool-panel-head">
        <span className="playground-tool-panel-label">Tools</span>
        <span className="playground-tool-panel-count">
          {counts.connectedActive} active
        </span>
      </div>

      <div className="playground-tool-search">
        <MagnifyingGlass size={13} className="playground-tool-search-icon" aria-hidden />
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search tools"
        />
      </div>

      <ul className="playground-tool-list">
        {filtered.map((tool) => (
          <li key={tool.id}>
            <button
              type="button"
              className={clsx(
                "playground-tool-item",
                selectedTool === tool.action && "playground-tool-item-selected",
              )}
              onClick={() => onSelectTool(tool.action)}
            >
              <BrandLogo name={tool.app} size={14} />
              <span className="playground-tool-item-action mono">{tool.action}</span>
              {tool.needsAuth && <span className="playground-tool-auth-dot" title="Needs auth" />}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
