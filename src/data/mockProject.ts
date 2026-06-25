import type { MockProject, ProjectMaturity } from "../types";

const activeProject: MockProject = {
  projectName: "Default Project",
  orgName: "ACME",
  health: {
    status: "degraded",
    environment: "Sandbox",
    activeFlows: 4,
    connectedTools: 8,
    usersEnabled: 24,
    lastRun: "2 min ago",
    toolCallSuccessRate: 91,
    blockedUsers: 8,
    criticalFailures: 3,
    authCompletionRate: 87,
    approvalBottleneckRate: 12,
    recoveryRateAfterFailure: 68,
  },
  usage: {
    executionsThisMonth: 723,
    executionsLimit: 1000,
    standardUsed: 705,
    standardLimit: 1000,
    proUsed: 18,
    proLimit: 50,
    userChallengesUsed: 42,
    userChallengesLimit: 100,
    mostUsedFlow: "Support Triage",
    mostUsedTool: "GitHub.CreateIssue",
    highestFailureTool: "Salesforce.UpdateRecord",
    mostBlockedAction: "Slack.SendMessage",
  },
  flows: [
    {
      id: "support-triage",
      name: "Support Triage",
      type: "MCP Gateway",
      status: "healthy",
      tools: ["Gmail", "Zendesk", "Slack"],
      usersEnabled: 24,
      runsToday: 142,
      successRate: 96,
      blockedActions: 1,
      lastRun: "2 min ago",
      nextAction: "View runs",
      nodes: [
        { id: "a1", label: "Support Triage", type: "agent", status: "healthy", meta: "142 runs · 96%" },
        { id: "t1", label: "Gmail.Search", type: "tool", status: "healthy", meta: "Connected · 97%" },
        { id: "t2", label: "Zendesk.CreateTicket", type: "tool", status: "healthy", meta: "Connected · 96%" },
        { id: "t3", label: "Slack.SendMessage", type: "tool", status: "healthy", meta: "Connected · 94%" },
        { id: "au1", label: "Audit log", type: "audit", status: "healthy", meta: "142 traces" },
      ],
      edges: [
        { from: "a1", to: "t1" },
        { from: "t1", to: "t2" },
        { from: "t2", to: "t3" },
        { from: "t3", to: "au1" },
      ],
    },
    {
      id: "bug-report",
      name: "Bug Report Agent",
      type: "Code agent",
      status: "policy_blocked",
      tools: ["GitHub", "Linear", "Slack"],
      usersEnabled: 12,
      runsToday: 68,
      successRate: 81,
      blockedActions: 4,
      lastRun: "8 min ago",
      nextAction: "Review policy",
      nodes: [
        { id: "a2", label: "Bug Report Agent", type: "agent", status: "degraded", meta: "68 runs · 81%" },
        { id: "t4", label: "GitHub.CreateIssue", type: "tool", status: "healthy", meta: "98% success" },
        { id: "t5", label: "Linear.CreateIssue", type: "tool", status: "healthy", meta: "95% success" },
        { id: "p1", label: "Slack approval", type: "policy", status: "policy_blocked", meta: "4 blocked" },
        { id: "t6", label: "Slack.SendMessage", type: "tool", status: "policy_blocked", meta: "Needs approval" },
        { id: "au2", label: "Audit log", type: "audit", status: "healthy", meta: "68 traces" },
      ],
      edges: [
        { from: "a2", to: "t4" },
        { from: "t4", to: "t5" },
        { from: "t5", to: "t6" },
        { from: "t6", to: "p1" },
        { from: "p1", to: "au2" },
      ],
    },
    {
      id: "crm-update",
      name: "CRM Update Agent",
      type: "Code agent",
      status: "degraded",
      tools: ["HubSpot", "Salesforce"],
      usersEnabled: 8,
      runsToday: 27,
      successRate: 74,
      blockedActions: 5,
      lastRun: "18 min ago",
      nextAction: "Debug",
      nodes: [
        { id: "a3", label: "CRM Update Agent", type: "agent", status: "degraded", meta: "27 runs · 74%" },
        { id: "t7", label: "HubSpot.SearchContacts", type: "tool", status: "healthy", meta: "92% success" },
        { id: "t8", label: "Salesforce.UpdateRecord", type: "tool", status: "degraded", meta: "74% · UpstreamError" },
        { id: "au3", label: "Audit log", type: "audit", status: "healthy", meta: "27 traces" },
      ],
      edges: [
        { from: "a3", to: "t7" },
        { from: "t7", to: "t8" },
        { from: "t8", to: "au3" },
      ],
    },
    {
      id: "inbox-assistant",
      name: "Inbox Assistant",
      type: "MCP Gateway",
      status: "waiting_for_client",
      tools: ["Gmail", "Slack"],
      usersEnabled: 1,
      runsToday: 0,
      successRate: null,
      blockedActions: 0,
      lastRun: "Never",
      nextAction: "Copy Cursor config",
      nodes: [
        { id: "a4", label: "Inbox Assistant", type: "agent", status: "waiting_for_client", meta: "No client connected" },
        { id: "t9", label: "Gmail.Search", type: "tool", status: "ready_to_deploy", meta: "Connected" },
        { id: "t10", label: "Slack.SendMessage", type: "tool", status: "ready_to_deploy", meta: "Connected" },
        { id: "au4", label: "Audit log", type: "audit", status: "waiting_for_client", meta: "Waiting" },
      ],
      edges: [
        { from: "a4", to: "t9" },
        { from: "t9", to: "t10" },
        { from: "t10", to: "au4" },
      ],
    },
  ],
  runs: [
    {
      id: "run-1",
      name: "CSV export bug report",
      flowId: "bug-report",
      flowName: "Bug Report Agent",
      triggeredBy: "Chat prompt",
      user: "Alex Morgan",
      status: "success",
      toolsCalled: ["GitHub", "Linear", "Slack"],
      policyResult: "Allowed",
      duration: "14s",
      timestamp: "2 min ago",
      traceSteps: [
        { time: "02:44:01.150", message: "User verified: Alex Morgan", status: "success" },
        { time: "02:44:01.420", message: "GitHub scopes approved: repo:read, issues:write", status: "success" },
        { time: "02:44:02.100", message: "GitHub.CreateIssue executed → issue #842", status: "success" },
        { time: "02:44:02.800", message: "Linear.CreateIssue executed → ARC-291", status: "success" },
        { time: "02:44:03.400", message: "Slack.SendMessage executed → #engineering", status: "success" },
        { time: "02:44:03.810", message: "Audit log saved · trace arc_tr_8f2a", status: "success" },
      ],
    },
    {
      id: "run-2",
      name: "Customer escalation message",
      flowId: "bug-report",
      flowName: "Bug Report Agent",
      triggeredBy: "Slack thread",
      user: "Priya Shah",
      status: "blocked",
      toolsCalled: ["Slack"],
      policyResult: "Approval required",
      duration: "8s",
      timestamp: "8 min ago",
      traceSteps: [
        { time: "02:36:01.100", message: "User verified: Priya Shah", status: "success" },
        { time: "02:36:01.350", message: "Slack scopes checked: channels:read", status: "success" },
        { time: "02:36:02.000", message: "Policy evaluated: #company-wide requires human confirmation", status: "blocked" },
        { time: "02:36:02.010", message: "Slack.SendMessage blocked", status: "blocked" },
        { time: "02:36:02.020", message: "Audit log saved · trace arc_tr_9b1c", status: "success" },
      ],
    },
    {
      id: "run-3",
      name: "Lead update from email",
      flowId: "crm-update",
      flowName: "CRM Update Agent",
      triggeredBy: "Email",
      user: "Sam Lee",
      status: "failed",
      toolsCalled: ["HubSpot", "Salesforce"],
      policyResult: "Allowed",
      duration: "12s",
      timestamp: "18 min ago",
      traceSteps: [
        { time: "02:26:01.200", message: "User verified: Sam Lee", status: "success" },
        { time: "02:26:01.500", message: "Salesforce token valid", status: "success" },
        { time: "02:26:02.100", message: "Policy allowed Salesforce.UpdateRecord", status: "success" },
        { time: "02:26:03.800", message: "Salesforce.UpdateRecord → UpstreamError (503)", status: "failed" },
        { time: "02:26:03.810", message: "Run marked failed · audit log saved", status: "failed" },
      ],
    },
    {
      id: "run-4",
      name: "Refund request triage",
      flowId: "support-triage",
      flowName: "Support Triage",
      triggeredBy: "Zendesk ticket",
      user: "Alex Morgan",
      status: "blocked",
      toolsCalled: ["Zendesk", "Stripe"],
      policyResult: "Approval required",
      duration: "9s",
      timestamp: "12 min ago",
      traceSteps: [
        { time: "02:32:01.000", message: "User verified: Alex Morgan", status: "success" },
        { time: "02:32:02.100", message: "Policy: Refund above $50 requires approval", status: "blocked" },
        { time: "02:32:02.110", message: "Stripe.CreateRefund blocked", status: "blocked" },
        { time: "02:32:02.120", message: "Audit log saved", status: "success" },
      ],
    },
  ],
  toolCalls: [
    { id: "tc1", action: "GitHub.CreateIssue", app: "GitHub", usedBy: "Bug Report Agent", authMode: "User OAuth", successRate: 98, failureRate: 2, p50Latency: "800ms", risk: "Medium", lastError: "—", flowIds: ["bug-report"] },
    { id: "tc2", action: "Slack.SendMessage", app: "Slack", usedBy: "3 flows", authMode: "User OAuth", successRate: 72, failureRate: 28, p50Latency: "1.2s", risk: "Medium", lastError: "Approval missing", flowIds: ["bug-report", "support-triage", "inbox-assistant"] },
    { id: "tc3", action: "Salesforce.UpdateRecord", app: "Salesforce", usedBy: "CRM Update Agent", authMode: "User OAuth", successRate: 74, failureRate: 26, p50Latency: "2.1s", risk: "High", lastError: "UpstreamError", flowIds: ["crm-update"] },
    { id: "tc4", action: "Zendesk.CreateTicket", app: "Zendesk", usedBy: "Support Triage", authMode: "User OAuth", successRate: 96, failureRate: 4, p50Latency: "950ms", risk: "Medium", lastError: "—", flowIds: ["support-triage"] },
    { id: "tc5", action: "Linear.CreateIssue", app: "Linear", usedBy: "Bug Report Agent", authMode: "User OAuth", successRate: 95, failureRate: 5, p50Latency: "720ms", risk: "Low", lastError: "—", flowIds: ["bug-report"] },
  ],
  users: [
    { id: "u1", name: "Alex Morgan", role: "Builder", enabledFlows: "Bug Report Agent", connectedApps: "GitHub, Slack", verification: "Verified", lastActive: "4 min ago", toolCalls: 38, flowIds: ["bug-report"] },
    { id: "u2", name: "Support Team", role: "Group", enabledFlows: "Support Triage", connectedApps: "Zendesk, Gmail", verification: "16/20 verified", lastActive: "1 hr ago", toolCalls: 142, flowIds: ["support-triage"] },
    { id: "u3", name: "Priya Shah", role: "Admin", enabledFlows: "All flows", connectedApps: "GitHub, Slack, Salesforce", verification: "Pending auth", lastActive: "—", toolCalls: 0, flowIds: ["bug-report", "crm-update"] },
    { id: "u4", name: "Sam Lee", role: "Builder", enabledFlows: "CRM Update Agent", connectedApps: "HubSpot, Salesforce", verification: "Verified", lastActive: "18 min ago", toolCalls: 27, flowIds: ["crm-update"] },
  ],
  auth: [
    { id: "auth1", app: "GitHub", authType: "OAuth", connectedUsers: 8, requiredScopes: "repo:read, issues:write", approvedScopes: "repo:read, issues:write", usedBy: "2 flows", tokenStatus: "Healthy", issue: "—", action: "View", flowIds: ["bug-report", "support-triage"] },
    { id: "auth2", app: "Slack", authType: "OAuth", connectedUsers: 12, requiredScopes: "channels:read, chat:write", approvedScopes: "channels:read", usedBy: "3 flows", tokenStatus: "Healthy", issue: "Missing chat:write", action: "Reauthorize", flowIds: ["bug-report", "support-triage", "inbox-assistant"] },
    { id: "auth3", app: "Salesforce", authType: "OAuth", connectedUsers: 3, requiredScopes: "records:read/write", approvedScopes: "records:read/write", usedBy: "CRM Update Agent", tokenStatus: "Expiring soon", issue: "Token expires in 2 days", action: "Reauthorize", flowIds: ["crm-update"] },
  ],
  policies: [
    { id: "pol1", policy: "Slack send approval", type: "Human confirmation", status: "Active", triggered: 4, affectedFlow: "Bug Report Agent", decision: "Require approval", action: "Review", flowId: "bug-report" },
    { id: "pol2", policy: "Salesforce write restriction", type: "Contextual access", status: "Blocking", triggered: 5, affectedFlow: "CRM Update Agent", decision: "Block", action: "Edit", flowId: "crm-update" },
    { id: "pol3", policy: "Refund above $50", type: "Human confirmation", status: "Active", triggered: 2, affectedFlow: "Support Triage", decision: "Require approval", action: "View", flowId: "support-triage" },
    { id: "pol4", policy: "PII redaction", type: "Data filter", status: "Active", triggered: 22, affectedFlow: "Support Triage", decision: "Redact", action: "View", flowId: "support-triage" },
  ],
  audit: [
    { id: "aud1", time: "2 min ago", actor: "Agent", flow: "Bug Report Agent", toolAction: "GitHub.CreateIssue", onBehalfOf: "Alex Morgan", system: "GitHub", result: "Success", traceId: "arc_tr_8f2a", flowId: "bug-report", runId: "run-1" },
    { id: "aud2", time: "8 min ago", actor: "Agent", flow: "Bug Report Agent", toolAction: "Slack.SendMessage", onBehalfOf: "Priya Shah", system: "Slack", result: "Blocked", traceId: "arc_tr_9b1c", flowId: "bug-report", runId: "run-2" },
    { id: "aud3", time: "18 min ago", actor: "Agent", flow: "CRM Update Agent", toolAction: "Salesforce.UpdateRecord", onBehalfOf: "Sam Lee", system: "Salesforce", result: "Failed", traceId: "arc_tr_7d4e", flowId: "crm-update", runId: "run-3" },
    { id: "aud4", time: "12 min ago", actor: "Agent", flow: "Support Triage", toolAction: "Stripe.CreateRefund", onBehalfOf: "Alex Morgan", system: "Stripe", result: "Blocked", traceId: "arc_tr_3a9f", flowId: "support-triage", runId: "run-4" },
  ],
  attention: [
    { id: "att1", issue: "Slack missing chat:write scope", severity: "high", affectedFlow: "Bug Report Agent", category: "Authorization", impact: "4 blocked messages", nextAction: "Reauthorize Slack", flowId: "bug-report" },
    { id: "att2", issue: "GitHub token expires in 2 days", severity: "medium", affectedFlow: "Bug Report Agent", category: "Authorization", impact: "2 flows affected", nextAction: "Reauthorize", flowId: "bug-report" },
    { id: "att3", issue: "Salesforce update failing (UpstreamError)", severity: "high", affectedFlow: "CRM Update Agent", category: "Runtime", impact: "5 failed updates", nextAction: "Debug", flowId: "crm-update" },
    { id: "att4", issue: "Gateway has no client connection", severity: "low", affectedFlow: "Inbox Assistant", category: "Setup", impact: "No tool calls yet", nextAction: "Copy Cursor config", flowId: "inbox-assistant" },
    { id: "att5", issue: "Slack send blocked by policy", severity: "medium", affectedFlow: "Bug Report Agent", category: "Policy", impact: "4 pending approvals", nextAction: "Review policy", flowId: "bug-report" },
  ],
};

const flowNoAuthProject: MockProject = {
  ...activeProject,
  health: {
    ...activeProject.health,
    status: "needs_auth",
    activeFlows: 1,
    connectedTools: 0,
    toolCallSuccessRate: 0,
    blockedUsers: 0,
    criticalFailures: 0,
    authCompletionRate: 42,
    approvalBottleneckRate: 0,
    recoveryRateAfterFailure: 0,
    lastRun: "Never",
  },
  flows: [
    {
      id: "bug-report",
      name: "Bug Report Agent",
      type: "Code agent",
      status: "needs_auth",
      tools: ["GitHub", "Linear", "Slack"],
      usersEnabled: 1,
      runsToday: 0,
      successRate: null,
      blockedActions: 0,
      lastRun: "Never",
      nextAction: "Authorize GitHub",
      nodes: [
        { id: "a2", label: "Bug Report Agent", type: "agent", status: "needs_auth", meta: "0 runs" },
        { id: "auth-g", label: "GitHub OAuth", type: "auth", status: "needs_auth", meta: "Not connected" },
        { id: "t4", label: "GitHub.CreateIssue", type: "tool", status: "needs_auth", meta: "Needs connection" },
        { id: "au2", label: "Audit log", type: "audit", status: "waiting_for_client", meta: "Waiting" },
      ],
      edges: [
        { from: "a2", to: "auth-g" },
        { from: "auth-g", to: "t4" },
        { from: "t4", to: "au2" },
      ],
    },
  ],
  runs: [],
  attention: [
    { id: "att-auth", issue: "GitHub authorization required", severity: "high", affectedFlow: "Bug Report Agent", category: "Authorization", impact: "Flow cannot run", nextAction: "Authorize GitHub", flowId: "bug-report" },
  ],
};

const firstRunProject: MockProject = {
  ...flowNoAuthProject,
  health: {
    ...flowNoAuthProject.health,
    status: "healthy",
    connectedTools: 3,
    toolCallSuccessRate: 100,
    blockedUsers: 0,
    criticalFailures: 0,
    authCompletionRate: 100,
    approvalBottleneckRate: 0,
    recoveryRateAfterFailure: 100,
    lastRun: "2 min ago",
  },
  flows: [
    {
      ...flowNoAuthProject.flows[0],
      status: "healthy",
      runsToday: 1,
      successRate: 100,
      lastRun: "2 min ago",
      nextAction: "Deploy to test users",
      nodes: [
        { id: "a2", label: "Bug Report Agent", type: "agent", status: "healthy", meta: "1 run · 100%" },
        { id: "t4", label: "GitHub.CreateIssue", type: "tool", status: "healthy", meta: "Connected · 100%" },
        { id: "au2", label: "Audit log", type: "audit", status: "healthy", meta: "1 trace" },
      ],
      edges: [
        { from: "a2", to: "t4" },
        { from: "t4", to: "au2" },
      ],
    },
  ],
  runs: [activeProject.runs[0]],
  audit: [activeProject.audit[0]],
  attention: [],
};

const emptyProject: MockProject = {
  projectName: "Default Project",
  orgName: "ACME",
  health: {
    status: "setup_incomplete",
    environment: "Sandbox",
    activeFlows: 0,
    connectedTools: 0,
    usersEnabled: 1,
    lastRun: "—",
    toolCallSuccessRate: 0,
    blockedUsers: 0,
    criticalFailures: 0,
    authCompletionRate: 0,
    approvalBottleneckRate: 0,
    recoveryRateAfterFailure: 0,
  },
  usage: {
    executionsThisMonth: 0,
    executionsLimit: 1000,
    standardUsed: 0,
    standardLimit: 1000,
    proUsed: 0,
    proLimit: 50,
    userChallengesUsed: 0,
    userChallengesLimit: 100,
    mostUsedFlow: "—",
    mostUsedTool: "—",
    highestFailureTool: "—",
    mostBlockedAction: "—",
  },
  flows: [],
  runs: [],
  toolCalls: [],
  users: [
    { id: "u0", name: "Sambit Nayak", role: "Owner", enabledFlows: "—", connectedApps: "—", verification: "Verified", lastActive: "Now", toolCalls: 0, flowIds: [] },
  ],
  auth: [],
  policies: [],
  audit: [],
  attention: [],
};

export function getMockProject(maturity: ProjectMaturity): MockProject {
  switch (maturity) {
    case "empty":
      return emptyProject;
    case "flow_no_auth":
      return flowNoAuthProject;
    case "first_run":
      return firstRunProject;
    case "active":
      return activeProject;
    default:
      return emptyProject;
  }
}

export const recommendedTools = [
  { action: "GitHub.CreateIssue", app: "GitHub", status: "Needs connection" },
  { action: "Slack.SendMessage", app: "Slack", status: "Needs connection" },
  { action: "Gmail.Search", app: "Gmail", status: "Needs connection" },
  { action: "Linear.CreateIssue", app: "Linear", status: "Needs connection" },
];

export const GATEWAY_CONFIG = `{
  "mcpServers": {
    "arcade-gateway": {
      "url": "https://api.arcade.dev/v1/gateways/engineering-triage/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_ARCADE_API_KEY"
      }
    }
  }
}`;

export const SDK_INSTALL = "npm install @arcadeai/arcade";

export const API_KEY_PLACEHOLDER = "ARCADE_API_KEY=arc_live_••••••••••••••••";
