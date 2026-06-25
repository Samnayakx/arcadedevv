export type Screen =
  | "create-organization"
  | "create-project"
  | "get-started"
  | "build"
  | "gateway"
  | "sandbox"
  | "empty"
  | "active"
  | "playground"
  | "agent-detail";

export type ProjectMaturity =
  | "empty"
  | "flow_no_auth"
  | "first_run"
  | "active";

export type FlowStatus =
  | "healthy"
  | "needs_auth"
  | "policy_blocked"
  | "degraded"
  | "waiting_for_client"
  | "ready_to_deploy"
  | "setup_incomplete";

export type RunStatus =
  | "success"
  | "blocked"
  | "failed"
  | "running"
  | "waiting_auth"
  | "waiting_approval";

export type TabId =
  | "dashboard"
  | "flows"
  | "runs"
  | "tool-calls"
  | "users"
  | "auth"
  | "policies"
  | "audit"
  | "usage";

export type Severity = "high" | "medium" | "low";

export type AttentionCategory =
  | "Authorization"
  | "Policy"
  | "Runtime"
  | "Rollout"
  | "Usage"
  | "Audit"
  | "Setup";

export interface FlowNode {
  id: string;
  label: string;
  type: "agent" | "tool" | "auth" | "policy" | "audit";
  status: FlowStatus;
  meta?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
}

export interface AgentFlow {
  id: string;
  name: string;
  type: "Code agent" | "MCP Gateway" | "Sandbox";
  status: FlowStatus;
  tools: string[];
  usersEnabled: number;
  runsToday: number;
  successRate: number | null;
  blockedActions: number;
  lastRun: string;
  nextAction: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface Run {
  id: string;
  name: string;
  flowId: string;
  flowName: string;
  triggeredBy: string;
  user: string;
  status: RunStatus;
  toolsCalled: string[];
  policyResult: string;
  duration: string;
  timestamp: string;
  traceSteps: TraceStep[];
}

export interface TraceStep {
  time: string;
  message: string;
  status: "success" | "blocked" | "failed" | "info";
}

export interface ToolCallHealth {
  id: string;
  action: string;
  app: string;
  usedBy: string;
  authMode: string;
  successRate: number;
  failureRate: number;
  p50Latency: string;
  risk: "Low" | "Medium" | "High";
  lastError: string;
  flowIds: string[];
}

export interface ProjectUser {
  id: string;
  name: string;
  role: string;
  enabledFlows: string;
  connectedApps: string;
  verification: string;
  lastActive: string;
  toolCalls: number;
  flowIds: string[];
}

export interface AuthRecord {
  id: string;
  app: string;
  authType: string;
  connectedUsers: number;
  requiredScopes: string;
  approvedScopes: string;
  usedBy: string;
  tokenStatus: string;
  issue: string;
  action: string;
  flowIds: string[];
}

export interface PolicyRecord {
  id: string;
  policy: string;
  type: string;
  status: string;
  triggered: number;
  affectedFlow: string;
  decision: string;
  action: string;
  flowId: string;
}

export interface AuditRecord {
  id: string;
  time: string;
  actor: string;
  flow: string;
  toolAction: string;
  onBehalfOf: string;
  system: string;
  result: string;
  traceId: string;
  flowId: string;
  runId?: string;
}

export interface AttentionItem {
  id: string;
  issue: string;
  severity: Severity;
  affectedFlow: string;
  category: AttentionCategory;
  impact: string;
  nextAction: string;
  flowId: string;
}

export interface ProjectHealth {
  status: FlowStatus;
  environment: string;
  activeFlows: number;
  connectedTools: number;
  usersEnabled: number;
  lastRun: string;
  toolCallSuccessRate: number;
  blockedUsers: number;
  criticalFailures: number;
  authCompletionRate: number;
  approvalBottleneckRate: number;
  recoveryRateAfterFailure: number;
}

export interface UsageSummary {
  executionsThisMonth: number;
  executionsLimit: number;
  standardUsed: number;
  standardLimit: number;
  proUsed: number;
  proLimit: number;
  userChallengesUsed: number;
  userChallengesLimit: number;
  mostUsedFlow: string;
  mostUsedTool: string;
  highestFailureTool: string;
  mostBlockedAction: string;
}

export interface MockProject {
  projectName: string;
  orgName: string;
  flows: AgentFlow[];
  runs: Run[];
  toolCalls: ToolCallHealth[];
  users: ProjectUser[];
  auth: AuthRecord[];
  policies: PolicyRecord[];
  audit: AuditRecord[];
  attention: AttentionItem[];
  health: ProjectHealth;
  usage: UsageSummary;
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  mono?: boolean;
}
