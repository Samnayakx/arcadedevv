import { ArrowRight, Bug, ChatsCircle, Database } from "@phosphor-icons/react";
import type { AgentFlow, FlowStatus } from "../../types";
import { Btn } from "../primitives/Btn";
import { CardHead } from "../primitives/CardHead";
import { Icon } from "../primitives/Icon";
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
    return <Icon icon={ChatsCircle} size="lg" weight="duotone" aria-hidden />;
  }
  if (lower.includes("bug")) {
    return <Icon icon={Bug} size="lg" weight="duotone" aria-hidden />;
  }
  if (lower.includes("crm")) {
    return <Icon icon={Database} size="lg" weight="duotone" aria-hidden />;
  }
  return <Icon icon={ChatsCircle} size="lg" weight="duotone" aria-hidden />;
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
      <CardHead
        title="Agents"
        subtitle="Health and last activity across your agent flows"
        subtitleClassName="agent-cards-subtitle"
        meta={flows.length > 0 ? `${flows.length} active` : undefined}
      />

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
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenAgent(flow.id)}
                      >
                        {action}
                        <Icon icon={ArrowRight} size="sm" weight="bold" aria-hidden />
                      </Btn>
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
