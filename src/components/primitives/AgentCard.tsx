import clsx from "clsx";
import type { AgentFlow } from "../../types";
import { AppLogoList } from "./AppChip";
import { StatusBadge } from "./StatusBadge";

export function AgentCard({
  flow,
  active,
  onClick,
}: {
  flow: AgentFlow;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={clsx("agent-card", active && "agent-card-active")}
      onClick={onClick}
    >
      <div className="agent-card-top">
        <span className="agent-card-name">{flow.name}</span>
        <StatusBadge status={flow.status} small />
      </div>
      <AppLogoList apps={flow.tools} />
      <span className="agent-card-meta">Last run {flow.lastRun}</span>
    </button>
  );
}
