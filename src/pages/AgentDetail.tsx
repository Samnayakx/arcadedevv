import { useMemo, useState } from "react";
import { CaretLeft } from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { getMockProject } from "../data/mockProject";
import { AgentFlowMap } from "../components/home/AgentFlowMap";
import { DataTable } from "../components/primitives/DataTable";
import { AppChip, AppLogoList } from "../components/primitives/AppChip";
import { AuthBadge } from "../components/primitives/AuthBadge";
import { ExecutionTraceRow } from "../components/primitives/ExecutionTraceRow";
import { StatusBadge } from "../components/primitives/StatusBadge";

const DETAIL_TABS = ["Overview", "Tools", "Auth", "Runs", "Policies"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

export function AgentDetail() {
  const {
    maturity,
    selectedAgentId,
    flowFilter,
    setFlowFilter,
    closeAgent,
    openTrace,
  } = useApp();
  const [tab, setTab] = useState<DetailTab>("Overview");

  const project = getMockProject(maturity);
  const agent =
    project.flows.find((flow) => flow.id === (selectedAgentId ?? flowFilter)) ??
    project.flows[0];

  const agentRuns = useMemo(
    () => project.runs.filter((run) => run.flowId === agent?.id),
    [project.runs, agent?.id],
  );

  const agentAuth = useMemo(
    () => project.auth.filter((record) => record.flowIds.includes(agent?.id ?? "")),
    [project.auth, agent?.id],
  );

  const agentPolicies = useMemo(
    () => project.policies.filter((policy) => policy.flowId === agent?.id),
    [project.policies, agent?.id],
  );

  const agentTools = useMemo(
    () => project.toolCalls.filter((tool) => tool.flowIds.includes(agent?.id ?? "")),
    [project.toolCalls, agent?.id],
  );

  if (!agent) {
    return (
      <div className="agent-detail">
        <p className="dashboard-empty-copy">Agent not found.</p>
        <button type="button" className="btn btn-secondary btn-md" onClick={closeAgent}>
          Back to Agents
        </button>
      </div>
    );
  }

  const inspectorTool = agentTools[0];

  return (
    <div className="agent-detail">
      <header className="agent-detail-header">
        <button type="button" className="agent-detail-back" onClick={closeAgent}>
          <CaretLeft size={16} weight="bold" />
          Agents
        </button>
        <div className="agent-detail-title-row">
          <div>
            <h1>{agent.name}</h1>
            <p>{agent.type} · Last run {agent.lastRun}</p>
          </div>
          <div className="agent-detail-header-actions">
            <StatusBadge status={agent.status} />
            <button type="button" className="btn btn-secondary btn-md">
              Deploy
            </button>
          </div>
        </div>
      </header>

      <div className="agent-detail-tabs">
        {DETAIL_TABS.map((item) => (
          <button
            key={item}
            type="button"
            className={`agent-detail-tab${tab === item ? " agent-detail-tab-active" : ""}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="agent-detail-body">
        <div className="agent-detail-main">
          {tab === "Overview" && (
            <AgentFlowMap
              flows={[agent]}
              selectedFlowId={agent.id}
              onSelectFlow={setFlowFilter}
              expanded
            />
          )}

          {tab === "Tools" && (
            <DataTable
              columns={[
                { key: "action", label: "Tool action" },
                { key: "successRate", label: "Success", render: (r) => `${r.successRate}%` },
                { key: "p50Latency", label: "P50", mono: true },
                { key: "risk", label: "Risk" },
              ]}
              rows={agentTools}
            />
          )}

          {tab === "Auth" && (
            <DataTable
              columns={[
                { key: "app", label: "App", render: (r) => <AppChip app={r.app} iconOnly /> },
                { key: "tokenStatus", label: "Status", render: (r) => (
                  <AuthBadge
                    status={
                      r.tokenStatus === "Valid"
                        ? "connected"
                        : r.tokenStatus === "Expired"
                          ? "expired"
                          : "pending"
                    }
                  />
                ) },
                { key: "requiredScopes", label: "Required scopes", mono: true },
                { key: "issue", label: "Issue" },
              ]}
              rows={agentAuth}
            />
          )}

          {tab === "Runs" && (
            <DataTable
              columns={[
                { key: "name", label: "Run" },
                { key: "user", label: "User" },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} small /> },
                { key: "duration", label: "Duration", mono: true },
              ]}
              rows={agentRuns}
              onRowAction={(r) => openTrace(r.id)}
              actionLabel="View trace"
            />
          )}

          {tab === "Policies" && (
            <DataTable
              columns={[
                { key: "policy", label: "Policy" },
                { key: "decision", label: "Decision" },
                { key: "triggered", label: "Triggered" },
              ]}
              rows={agentPolicies}
            />
          )}

          <div className="agent-detail-traces">
            <h3>Run trace logs</h3>
            {agentRuns.length === 0 ? (
              <p className="dashboard-empty-copy">No runs yet for this agent.</p>
            ) : (
              agentRuns.slice(0, 4).map((run) => (
                <ExecutionTraceRow
                  key={run.id}
                  time={run.timestamp}
                  message={run.name}
                  status={run.status === "success" ? "success" : run.status === "failed" ? "failed" : "info"}
                  steps={run.traceSteps}
                />
              ))
            )}
          </div>
        </div>

        <aside className="agent-detail-inspector">
          <h3>Inspector</h3>
          <p className="agent-detail-inspector-label">Selected tool</p>
          <p className="agent-detail-inspector-value">
            {inspectorTool?.action ?? agent.tools[0] ?? "—"}
          </p>

          <p className="agent-detail-inspector-label">Scopes required</p>
          <p className="agent-detail-inspector-value mono">
            {agentAuth[0]?.requiredScopes ?? "—"}
          </p>

          <p className="agent-detail-inspector-label">Policies</p>
          <p className="agent-detail-inspector-value">
            {agentPolicies[0]?.policy ?? "Default allow with approval on write"}
          </p>

          <p className="agent-detail-inspector-label">Users impacted</p>
          <p className="agent-detail-inspector-value">{agent.usersEnabled} enabled users</p>

          <p className="agent-detail-inspector-label">Tools in flow</p>
          <AppLogoList apps={agent.tools} />
        </aside>
      </div>
    </div>
  );
}
