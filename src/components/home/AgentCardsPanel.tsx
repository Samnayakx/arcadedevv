import { ArrowRight, Bug, ChatsCircle, Database } from "@phosphor-icons/react";
import type { AgentFlow, FlowStatus } from "../../types";
import { StatusBadge } from "../primitives/StatusBadge";

function agentActionLabel(status: FlowStatus): string {
  switch (status) {
    case "needs_auth":
      return "Fix";
    case "degraded":
      return "Debug";
    case "policy_blocked":
      return "Review";
    case "waiting_for_client":
      return "Connect";
    default:
      return "Open";
  }
}

function AgentIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("support") || lower.includes("inbox")) {
    return <ChatsCircle size={18} weight="duotone" />;
  }
  if (lower.includes("bug")) {
    return <Bug size={18} weight="duotone" />;
  }
  if (lower.includes("crm")) {
    return <Database size={18} weight="duotone" />;
  }
  return <ChatsCircle size={18} weight="duotone" />;
}

export function AgentCardsPanel({
  flows,
  onOpenAgent,
}: {
  flows: AgentFlow[];
  onOpenAgent: (flowId: string) => void;
}) {
  return (
    <div className="agent-cards dashboard-card dashboard-card-fill">
      <div className="dashboard-card-head">
        <div>
          <h3>Agents</h3>
          <p className="agent-cards-subtitle">
            Health and last activity across your agent flows
          </p>
        </div>
        <span className="dashboard-card-meta">{flows.length} active</span>
      </div>

      {flows.length === 0 ? (
        <p className="dashboard-empty-copy">No agents yet. Create your first flow to get started.</p>
      ) : (
        <div className="agent-cards-table-wrap">
          <table className="agent-cards-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Health</th>
                <th>Last run</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => {
                const action = agentActionLabel(flow.status);

                return (
                  <tr key={flow.id}>
                    <td className="agent-cards-name">
                      <button
                        type="button"
                        className="agent-cards-name-btn"
                        onClick={() => onOpenAgent(flow.id)}
                      >
                        <span className="agent-cards-icon" aria-hidden>
                          <AgentIcon name={flow.name} />
                        </span>
                        <span className="agent-cards-name-text">
                          <span className="agent-cards-title">{flow.name}</span>
                          <span className="agent-cards-type">{flow.type}</span>
                        </span>
                      </button>
                    </td>
                    <td className="agent-cards-health">
                      <StatusBadge status={flow.status} small />
                    </td>
                    <td className="agent-cards-last-run">
                      <span className="agent-cards-last-run-time">{flow.lastRun}</span>
                      {flow.runsToday > 0 && (
                        <span className="agent-cards-last-run-meta">
                          {flow.runsToday} today
                        </span>
                      )}
                    </td>
                    <td className="agent-cards-action">
                      <button
                        type="button"
                        className="agent-cards-action-btn"
                        onClick={() => onOpenAgent(flow.id)}
                      >
                        {action}
                        <ArrowRight size={14} weight="bold" aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
