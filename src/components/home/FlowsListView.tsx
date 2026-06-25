import {
  Funnel,
  GitBranch,
  PencilSimple,
  Prohibit,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { AgentFlow } from "../../types";
import { ListViewShell } from "../list/ListViewShell";
import { AppLogoList } from "../primitives/AppChip";
import { StatusBadge } from "../primitives/StatusBadge";

const STATUS_TABS = [
  { id: "all", label: "All flows" },
  { id: "healthy", label: "Healthy" },
  { id: "degraded", label: "Degraded" },
  { id: "blocked", label: "Blocked" },
] as const;

type StatusTab = (typeof STATUS_TABS)[number]["id"];

function matchesStatusTab(flow: AgentFlow, tab: StatusTab) {
  if (tab === "all") return true;
  if (tab === "healthy") return flow.status === "healthy";
  if (tab === "degraded") {
    return flow.status === "degraded" || flow.status === "needs_auth" || flow.status === "waiting_for_client";
  }
  return flow.status === "policy_blocked" || flow.status === "setup_incomplete";
}

const PAGE_SIZE = 8;

export function FlowsListView({
  flows,
  onViewRuns,
  onOpenAgent,
}: {
  flows: AgentFlow[];
  onViewRuns: (flowId: string) => void;
  onOpenAgent?: (flowId: string) => void;
}) {
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => flows.filter((flow) => matchesStatusTab(flow, statusTab)),
    [flows, statusTab],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allSelected = pageItems.length > 0 && pageItems.every((flow) => selected.has(flow.id));

  const toggleAll = () => {
    setSelected((current) => {
      const next = new Set(current);
      if (allSelected) {
        pageItems.forEach((flow) => next.delete(flow.id));
      } else {
        pageItems.forEach((flow) => next.add(flow.id));
      }
      return next;
    });
  };

  const toggleOne = (flowId: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(flowId)) next.delete(flowId);
      else next.add(flowId);
      return next;
    });
  };

  return (
    <ListViewShell
      breadcrumb={
        <>
          <span>Dashboard</span>
          <span className="list-view-breadcrumb-sep">/</span>
          <span className="list-view-breadcrumb-current">Agents</span>
        </>
      }
      title="Agents"
      titleIcon={<GitBranch size={22} weight="regular" className="list-view-title-icon" />}
      tabs={STATUS_TABS.map((tab) => ({ id: tab.id, label: tab.label }))}
      activeTab={statusTab}
      onTabChange={(id) => {
        setStatusTab(id as StatusTab);
        setPage(1);
      }}
      toolbar={
        <>
          <label className="list-view-select-all">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span>Select all</span>
          </label>
          <div className="list-view-toolbar-actions">
            <button type="button" className="list-view-action-btn">
              <Funnel size={14} weight="regular" />
              Filters
            </button>
            <button type="button" className="list-view-action-btn">
              <Prohibit size={14} weight="regular" />
              Pause
            </button>
            <button type="button" className="list-view-action-btn">
              <PencilSimple size={14} weight="regular" />
              Edit
            </button>
          </div>
        </>
      }
      pagination={{
        page,
        totalPages,
        onPageChange: setPage,
      }}
    >
      <table className="list-view-table">
        <thead>
          <tr>
            <th className="list-view-col-check" aria-label="Select" />
            <th>Flow name</th>
            <th>Path</th>
            <th>Tools</th>
            <th>Status</th>
            <th>Last run</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((flow) => (
            <tr
              key={flow.id}
              className={selected.has(flow.id) ? "list-view-row-selected" : undefined}
            >
              <td className="list-view-col-check">
                <input
                  type="checkbox"
                  checked={selected.has(flow.id)}
                  onChange={() => toggleOne(flow.id)}
                  aria-label={`Select ${flow.name}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="list-view-row-link"
                  onClick={() => (onOpenAgent ? onOpenAgent(flow.id) : onViewRuns(flow.id))}
                >
                  <GitBranch size={14} weight="regular" className="list-view-row-icon" />
                  <span>{flow.name}</span>
                  <span className="list-view-row-meta">{flow.type}</span>
                </button>
              </td>
              <td className="mono list-view-path">/{flow.id}/</td>
              <td>
                <AppLogoList apps={flow.tools} size={14} />
              </td>
              <td>
                <StatusBadge status={flow.status} small />
              </td>
              <td className="list-view-muted">{flow.lastRun}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ListViewShell>
  );
}
