import { DotsSixVertical, MagnifyingGlass, X } from "@phosphor-icons/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { BrandLogo } from "../primitives/BrandLogo";
import {
  getPlaygroundToolCounts,
  PLAYGROUND_TOOLS,
} from "../../data/mockPlayground";

export const TOOL_DRAG_MIME = "application/x-arcade-tool";

export function PlaygroundToolPanel({
  onSelectTool,
  selectedTool,
  onClose,
}: {
  onSelectTool: (action: string) => void;
  selectedTool: string | null;
  onClose?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
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
        <span className="playground-tool-panel-count">{counts.connectedActive} active</span>
        {onClose && (
          <button
            type="button"
            className="playground-tool-panel-close"
            onClick={onClose}
            aria-label="Hide tools"
          >
            <X size={13} weight="bold" />
          </button>
        )}
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

      <p className="playground-tool-hint">Drag a tool into the chat, or click to add it.</p>

      <ul className="playground-tool-list">
        {filtered.map((tool) => (
          <li key={tool.id}>
            <button
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(TOOL_DRAG_MIME, tool.action);
                event.dataTransfer.setData("text/plain", tool.action);
                event.dataTransfer.effectAllowed = "copy";
                setDragging(tool.action);
              }}
              onDragEnd={() => setDragging(null)}
              className={clsx(
                "playground-tool-item",
                selectedTool === tool.action && "playground-tool-item-selected",
                dragging === tool.action && "playground-tool-item-dragging",
              )}
              onClick={() => onSelectTool(tool.action)}
            >
              <DotsSixVertical
                size={13}
                weight="bold"
                className="playground-tool-grip"
                aria-hidden
              />
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
