import {
  CaretDown,
  Globe,
  Key,
  MagnifyingGlass,
  Plugs,
  Plus,
  Wrench,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { CatalogToolTable } from "../components/catalog/CatalogToolTable";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { Btn } from "../components/primitives/Btn";
import { Icon } from "../components/primitives/Icon";
import { getCatalogTools } from "../data/catalogTools";
import {
  CATALOG_INTEGRATIONS,
  CATALOG_SIDEBAR_GROUPS,
  filterCatalogIntegrations,
  sortCatalogIntegrations,
  type CatalogAuthType,
  type CatalogFilter,
  type CatalogIntegration,
} from "../data/mockToolCatalog";

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

function CatalogRow({
  item,
  expanded,
  onToggle,
}: {
  item: CatalogIntegration;
  expanded: boolean;
  onToggle: () => void;
}) {
  const catalogTools = useMemo(
    () => getCatalogTools(item.id, item.name, item.toolCount, item.tools),
    [item.id, item.name, item.toolCount, item.tools],
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
        <div className="tool-catalog-row-detail">
          <CatalogToolTable tools={catalogTools} app={item.app} />
        </div>
      )}
    </div>
  );
}

export function ToolCatalog() {
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [connectedIds] = useState(
    () => new Set(CATALOG_INTEGRATIONS.filter((item) => item.connected).map((item) => item.id)),
  );

  const integrations = useMemo(
    () =>
      CATALOG_INTEGRATIONS.map((item) => ({
        ...item,
        connected: connectedIds.has(item.id),
      })),
    [connectedIds],
  );

  const filtered = useMemo(
    () => sortCatalogIntegrations(filterCatalogIntegrations(integrations, filter, search)),
    [integrations, filter, search],
  );

  return (
    <div className="tool-catalog-page">
      <aside className="tool-catalog-sidebar" aria-label="Tool catalog filters">
        <div className="tool-catalog-sidebar-head">
          <Plugs size={16} weight="regular" aria-hidden />
          <h1 className="tool-catalog-sidebar-title">Tool Catalog</h1>
        </div>

        <div className="tool-catalog-search">
          <MagnifyingGlass size={14} className="tool-catalog-search-icon" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search…"
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

        <Btn type="button" variant="primary" size="sm" className="tool-catalog-mcp-btn">
          <Icon icon={Plus} size="sm" weight="bold" />
          Custom MCP
        </Btn>
      </aside>

      <main className="tool-catalog-main">
        <div className="tool-catalog-list-header">
          <span className="tool-catalog-list-count">{filtered.length} integrations</span>
        </div>

        {filtered.length === 0 ? (
          <div className="tool-catalog-empty">
            <p>No integrations match your search.</p>
          </div>
        ) : (
          <div className="tool-catalog-list">
            {filtered.map((item) => (
              <CatalogRow
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
