import { ArrowRight } from "@phosphor-icons/react";
import type { AgentFlow, AttentionItem } from "../../types";
import { AppLogoList } from "../primitives/AppChip";
import { Btn } from "../primitives/Btn";
import { StatusBadge } from "../primitives/StatusBadge";

function issueCountForFlow(flowId: string, attention: AttentionItem[]) {
  return attention.filter((item) => item.flowId === flowId).length;
}

function formatIssueLabel(count: number) {
  if (count === 0) return "No open issues";
  if (count === 1) return "1 issue";
  return `${count} issues`;
}

function formatRunsToday(count: number) {
  if (count === 0) return "No runs today";
  if (count === 1) return "1 run today";
  return `${count} runs today`;
}

function formatSuccessRate(rate: number | null) {
  if (rate == null) return "— success";
  return `${rate}% success`;
}

export function FlowCards({
  flows,
  attention,
  onViewRuns,
}: {
  flows: AgentFlow[];
  attention: AttentionItem[];
  onViewRuns: (flowId: string) => void;
}) {
  return (
    <div className="flow-cards-grid">
      {flows.map((flow) => {
        const issues = issueCountForFlow(flow.id, attention);

        return (
          <article key={flow.id} className="flow-card dashboard-card">
            <div className="flow-card-head">
              <div className="flow-card-title-row">
                <h4 className="flow-card-title">{flow.name}</h4>
                <StatusBadge status={flow.status} small />
              </div>
              <span className="flow-card-type">{flow.type}</span>
            </div>

            <div className="flow-card-stats">
              <span>{formatRunsToday(flow.runsToday)}</span>
              <span className="flow-card-stat-sep" aria-hidden>·</span>
              <span>{formatSuccessRate(flow.successRate)}</span>
              <span className="flow-card-stat-sep" aria-hidden>·</span>
              <span className={issues > 0 ? "flow-card-stat-issue" : undefined}>
                {formatIssueLabel(issues)}
              </span>
            </div>

            <div className="flow-card-tools">
              <span className="flow-card-tools-label">Tools</span>
              <AppLogoList apps={flow.tools} size={16} />
            </div>

            <Btn
              variant="secondary"
              size="sm"
              className="flow-card-cta"
              onClick={() => onViewRuns(flow.id)}
            >
              View runs
              <ArrowRight size={14} weight="bold" />
            </Btn>
          </article>
        );
      })}
    </div>
  );
}
