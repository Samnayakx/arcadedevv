import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { recommendedTools } from "../../data/mockProject";
import type {
  AuditRecord,
  AuthRecord,
  MockProject,
  PolicyRecord,
  ProjectUser,
  TabId,
  ToolCallHealth,
} from "../../types";
import { DataTable } from "../primitives/DataTable";
import { Btn } from "../primitives/Btn";
import { AppChip, AppChipList, ToolActionCell } from "../primitives/AppChip";
import { EmptyState, EmptyStateActions } from "../primitives/EmptyState";

const TABS: { id: TabId; label: string }[] = [
  { id: "tool-calls", label: "Tool Calls" },
  { id: "users", label: "Users" },
  { id: "auth", label: "Auth" },
  { id: "policies", label: "Policies" },
  { id: "audit", label: "Audit" },
  { id: "usage", label: "Usage" },
];

const DEFAULT_OPERATIONAL_TAB: TabId = "tool-calls";

function resolveOperationalTab(activeTab: TabId): TabId {
  return TABS.some((tab) => tab.id === activeTab) ? activeTab : DEFAULT_OPERATIONAL_TAB;
}

function filterByFlow<T extends { flowId?: string; flowIds?: string[] }>(
  items: T[],
  flowFilter: string,
): T[] {
  if (flowFilter === "all") return items;
  return items.filter(
    (item) =>
      item.flowId === flowFilter ||
      item.flowIds?.includes(flowFilter),
  );
}

export function OperationalTabs({
  project,
  isEmpty,
}: {
  project: MockProject;
  isEmpty: boolean;
}) {
  const { activeTab, setActiveTab, flowFilter, openTrace, setScreen } = useApp();
  const selectedTab = resolveOperationalTab(activeTab);

  const toolCalls = filterByFlow(project.toolCalls, flowFilter) as ToolCallHealth[];
  const users = filterByFlow(project.users, flowFilter) as ProjectUser[];
  const auth = filterByFlow(project.auth, flowFilter) as AuthRecord[];
  const policies = filterByFlow(project.policies, flowFilter) as PolicyRecord[];
  const audit = filterByFlow(project.audit, flowFilter) as AuditRecord[];

  return (
    <div className="operational-tabs dashboard-card dashboard-card-fill">
      <div className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab ${selectedTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {selectedTab === tab.id && <motion.span layoutId="tab-underline" className="tab-underline" />}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab + flowFilter}
          className="tab-panel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === "tool-calls" &&
            (isEmpty ? (
              <div>
                <EmptyState
                  title="Recommended tools"
                  description="Connect starter tools for your first agent flow."
                />
                <DataTable
                  columns={[
                    { key: "action", label: "Tool action", render: (r) => <ToolActionCell action={r.action} /> },
                    { key: "status", label: "Status" },
                  ]}
                  rows={recommendedTools.map((t, i) => ({ id: String(i), ...t }))}
                />
              </div>
            ) : (
              <DataTable
                columns={[
                  { key: "action", label: "Tool action", render: (r) => <ToolActionCell action={r.action} /> },
                  { key: "usedBy", label: "Used by" },
                  { key: "authMode", label: "Auth mode" },
                  { key: "successRate", label: "Success", render: (r) => `${r.successRate}%` },
                  { key: "failureRate", label: "Failure", render: (r) => `${r.failureRate}%` },
                  { key: "p50Latency", label: "P50", mono: true },
                  { key: "risk", label: "Risk" },
                  { key: "lastError", label: "Last error", mono: true },
                ]}
                rows={toolCalls}
              />
            ))}

          {selectedTab === "users" && (
            <DataTable
              columns={[
                { key: "name", label: "User / group" },
                { key: "role", label: "Role" },
                { key: "enabledFlows", label: "Enabled flows" },
                { key: "connectedApps", label: "Connected apps", render: (r) => <AppChipList apps={r.connectedApps} iconOnly /> },
                { key: "verification", label: "Verification" },
                { key: "lastActive", label: "Last active" },
                { key: "toolCalls", label: "Tool calls" },
              ]}
              rows={users}
            />
          )}

          {selectedTab === "auth" &&
            (isEmpty || auth.length === 0 ? (
              <EmptyState
                title="No apps connected yet"
                description="Connect an app when a tool needs user authorization."
                actions={<EmptyStateActions primary="Connect first app" onPrimary={() => setScreen("sandbox")} />}
              />
            ) : (
              <DataTable
                columns={[
                  { key: "app", label: "App", render: (r) => <AppChip app={r.app} iconOnly /> },
                  { key: "authType", label: "Auth type" },
                  { key: "connectedUsers", label: "Connected users" },
                  { key: "requiredScopes", label: "Required scopes", mono: true },
                  { key: "approvedScopes", label: "Approved scopes", mono: true },
                  { key: "usedBy", label: "Used by" },
                  { key: "tokenStatus", label: "Token status" },
                  { key: "issue", label: "Issue" },
                  { key: "action", label: "Action", render: (r) => <Btn variant="link" size="sm">{r.action}</Btn> },
                ]}
                rows={auth}
              />
            ))}

          {selectedTab === "policies" &&
            (isEmpty || policies.length === 0 ? (
              <EmptyState
                title="No custom policies yet"
                description="Arcade can block, allow, or require approval for sensitive actions via Contextual Access."
              />
            ) : (
              <DataTable
                columns={[
                  { key: "policy", label: "Policy" },
                  { key: "type", label: "Type" },
                  { key: "status", label: "Status" },
                  { key: "triggered", label: "Triggered" },
                  { key: "affectedFlow", label: "Affected flow" },
                  { key: "decision", label: "Decision" },
                  { key: "action", label: "Action", render: (r) => <Btn variant="link" size="sm">{r.action}</Btn> },
                ]}
                rows={policies}
              />
            ))}

          {selectedTab === "audit" &&
            (isEmpty || audit.length === 0 ? (
              <EmptyState
                title="No audit events yet"
                description="Tool calls, auth checks, policy decisions, and user actions will appear here."
              />
            ) : (
              <DataTable
                columns={[
                  { key: "time", label: "Time" },
                  { key: "actor", label: "Actor" },
                  { key: "flow", label: "Agent / flow" },
                  { key: "toolAction", label: "Tool action", render: (r) => <ToolActionCell action={r.toolAction} /> },
                  { key: "onBehalfOf", label: "On behalf of" },
                  { key: "result", label: "Result" },
                  { key: "traceId", label: "Trace", mono: true, render: (r) => <Btn variant="link" size="sm" onClick={() => r.runId && openTrace(r.runId)}>View</Btn> },
                ]}
                rows={audit}
              />
            ))}

          {selectedTab === "usage" && (
            <div className="usage-panel">
              <div className="usage-cards">
                <div className="usage-card">
                  <span className="usage-label">Tool executions this month</span>
                  <span className="usage-value">{project.usage.executionsThisMonth} / {project.usage.executionsLimit}</span>
                </div>
                <div className="usage-card">
                  <span className="usage-label">Standard executions</span>
                  <span className="usage-value">{project.usage.standardUsed} / {project.usage.standardLimit}</span>
                </div>
                <div className="usage-card">
                  <span className="usage-label">Pro executions</span>
                  <span className="usage-value">{project.usage.proUsed} / {project.usage.proLimit}</span>
                </div>
                <div className="usage-card">
                  <span className="usage-label">User challenges</span>
                  <span className="usage-value">{project.usage.userChallengesUsed} / {project.usage.userChallengesLimit}</span>
                </div>
              </div>
              {!isEmpty && (
                <dl className="usage-stats">
                  <div><dt>Most used flow</dt><dd>{project.usage.mostUsedFlow}</dd></div>
                  <div><dt>Most used tool</dt><dd><ToolActionCell action={project.usage.mostUsedTool} /></dd></div>
                  <div><dt>Highest failure tool</dt><dd><ToolActionCell action={project.usage.highestFailureTool} /></dd></div>
                  <div><dt>Most blocked action</dt><dd><ToolActionCell action={project.usage.mostBlockedAction} /></dd></div>
                </dl>
              )}
              {isEmpty && <p className="usage-empty">Usage starts after your first tool execution.</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
