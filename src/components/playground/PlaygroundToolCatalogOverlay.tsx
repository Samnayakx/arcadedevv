import {
  CaretDown,
  Globe,
  Key,
  MagnifyingGlass,
  Plugs,
  Wrench,
  X,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { getCatalogTools, type CatalogTool } from "../../data/catalogTools";
import {
  getToolDisplayName,
  PLAYGROUND_TOOLS,
} from "../../data/mockPlayground";
import {
  CATALOG_INTEGRATIONS,
  CATALOG_SIDEBAR_GROUPS,
  filterCatalogIntegrations,
  sortCatalogIntegrations,
  type CatalogAuthType,
  type CatalogFilter,
  type CatalogIntegration,
} from "../../data/mockToolCatalog";
import { BrandLogo } from "../primitives/BrandLogo";

function CatalogAuthBadge({ type }: { type: CatalogAuthType }) {
  const isOAuth = type === "OAuth";

  return (
    <span
      className={clsx(
        "tool-catalog-auth-badge",
        isOAuth ? "tool-catalog-auth-badge-oauth" : "tool-catalog-auth-badge-secrets",
      )}
    >
      {isOAuth ? <Globe size={12} weight="regular" /> : <Key size={12} weight="regular" />}
      {type}
    </span>
  );
}

function resolvePlaygroundAction(integration: CatalogIntegration, toolName: string): string {
  const exact = integration.tools.find(
    (tool) => tool === toolName || tool.endsWith(`.${toolName}`),
  );
  if (exact) return exact;

  const playgroundMatch = PLAYGROUND_TOOLS.find(
    (tool) =>
      tool.app === integration.app &&
      (tool.action === `${integration.app}.${toolName}` ||
        tool.displayName === toolName ||
        getToolDisplayName(tool.action) === toolName),
  );
  if (playgroundMatch) return playgroundMatch.action;

  return `${integration.app}.${toolName}`;
}

function getOverlayTools(integration: CatalogIntegration, search: string): CatalogTool[] {
  const tools =
    integration.tools.length > 0
      ? integration.tools.map((fullName, index) => {
          const name = fullName.includes(".") ? fullName.split(".").pop()! : fullName;
          return {
            id: `${integration.id}-tool-${index}`,
            name,
            description: `Execute ${name} through the ${integration.name} integration.`,
            paramCount: 2 + (index % 3),
            requirement: `arcade-${integration.id}`,
            action: fullName.includes(".") ? fullName : `${integration.app}.${name}`,
          };
        })
      : getCatalogTools(
          integration.id,
          integration.name,
          integration.toolCount,
          integration.tools,
        ).map((tool) => ({
          ...tool,
          action: `${integration.app}.${tool.name}`,
        }));

  const query = search.trim().toLowerCase();
  if (!query) return tools.slice(0, 24);

  return tools
    .filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        ("action" in tool && String(tool.action).toLowerCase().includes(query)),
    )
    .slice(0, 24);
}

type OverlayCatalogTool = CatalogTool & { action?: string };

function OverlayCatalogRow({
  item,
  expanded,
  toolSearch,
  activeAction,
  onToggle,
  onSelectTool,
}: {
  item: CatalogIntegration;
  expanded: boolean;
  toolSearch: string;
  activeAction: string;
  onToggle: () => void;
  onSelectTool: (action: string) => void;
}) {
  const tools = useMemo(
    () => getOverlayTools(item, toolSearch) as OverlayCatalogTool[],
    [item, toolSearch],
  );

  return (
    <div className={clsx("tool-catalog-row-wrap", expanded && "tool-catalog-row-wrap-expanded")}>
      <button
        type="button"
        className="tool-catalog-row"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <BrandLogo name={item.app} size="lg" className="tool-catalog-row-logo" />

        <div className="tool-catalog-row-copy">
          <div className="tool-catalog-row-title-line">
            <span className="tool-catalog-row-name">{item.name}</span>
            <span className="tool-catalog-row-version mono">{item.version}</span>
          </div>
          <p className="tool-catalog-row-desc">{item.description}</p>
        </div>

        <div className="tool-catalog-row-meta">
          <CatalogAuthBadge type={item.authType} />
          <span className="tool-catalog-tool-count">
            <Wrench size={12} weight="regular" aria-hidden />
            {item.toolCount} tools
          </span>
          <CaretDown
            size={14}
            weight="bold"
            className={clsx("tool-catalog-row-chevron", expanded && "tool-catalog-row-chevron-open")}
            aria-hidden
          />
        </div>
      </button>

      {expanded && (
        <div className="playground-catalog-tool-list-wrap">
          <ul className="playground-catalog-tool-list">
            {tools.map((tool) => {
              const action = tool.action ?? resolvePlaygroundAction(item, tool.name);
              const isActive = action === activeAction;

              return (
                <li key={tool.id}>
                  <button
                    type="button"
                    className={clsx("playground-catalog-tool-item", isActive && "active")}
                    onClick={() => onSelectTool(action)}
                  >
                    <span className="playground-catalog-tool-item-name mono">{tool.name}</span>
                    <span className="playground-catalog-tool-item-desc">{tool.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PlaygroundToolCatalogOverlay({
  open,
  activeAction,
  onClose,
  onSelectTool,
}: {
  open: boolean;
  activeAction: string;
  onClose: () => void;
  onSelectTool: (action: string) => void;
}) {
  const [filter, setFilter] = useState<CatalogFilter>("connected");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("github");

  const integrations = useMemo(
    () =>
      CATALOG_INTEGRATIONS.map((item) => ({
        ...item,
        connected: PLAYGROUND_TOOLS.some((tool) => tool.app === item.app && tool.connected) || item.connected,
      })),
    [],
  );

  const filtered = useMemo(
    () => sortCatalogIntegrations(filterCatalogIntegrations(integrations, filter, search)),
    [integrations, filter, search],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setFilter("connected");
    }
  }, [open]);

  if (!open) return null;

  const handleSelect = (action: string) => {
    onSelectTool(action);
    onClose();
  };

  return (
    <div className="playground-catalog-overlay-root">
      <button
        type="button"
        className="playground-catalog-overlay-backdrop"
        aria-label="Close tool catalog"
        onClick={onClose}
      />
      <div
        className="playground-catalog-overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Tool catalog"
      >
        <header className="playground-catalog-overlay-head">
          <div className="playground-catalog-overlay-title">
            <Plugs size={16} weight="regular" aria-hidden />
            <h2>Tool catalog</h2>
          </div>
          <button type="button" className="playground-catalog-overlay-close" aria-label="Close" onClick={onClose}>
            <X size={16} weight="bold" />
          </button>
        </header>

        <div className="playground-catalog-overlay-body tool-catalog-page">
          <aside className="tool-catalog-sidebar" aria-label="Catalog filters">
            <div className="tool-catalog-search">
              <MagnifyingGlass size={14} className="tool-catalog-search-icon" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search integrations…"
                aria-label="Search integrations"
              />
            </div>

            <nav className="tool-catalog-nav">
              {CATALOG_SIDEBAR_GROUPS.map((group, index) => (
                <div key={group.label ?? `group-${index}`} className="tool-catalog-nav-group">
                  {group.label && <span className="tool-catalog-nav-label">{group.label}</span>}
                  <ul className="tool-catalog-nav-list">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={clsx(
                            "tool-catalog-nav-item",
                            filter === item.id && "tool-catalog-nav-item-active",
                          )}
                          onClick={() => setFilter(item.id)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main className="tool-catalog-main playground-catalog-overlay-main">
            <div className="tool-catalog-list-header">
              <span className="tool-catalog-list-count">{filtered.length} integrations</span>
              <span className="playground-catalog-overlay-hint">Select a tool to load setup</span>
            </div>

            {filtered.length === 0 ? (
              <div className="tool-catalog-empty">
                <p>No integrations match your search.</p>
              </div>
            ) : (
              <div className="tool-catalog-list">
                {filtered.map((item) => (
                  <OverlayCatalogRow
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    toolSearch={search}
                    activeAction={activeAction}
                    onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                    onSelectTool={handleSelect}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
