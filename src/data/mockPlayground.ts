import type { TracePreview } from "../types";

export type ToolCategory = "Communication" | "CRM" | "DevOps" | "Productivity" | "All";

export interface PlaygroundTool {
  id: string;
  app: string;
  action: string;
  displayName?: string;
  version?: string;
  category: Exclude<ToolCategory, "All">;
  connected: boolean;
  needsAuth?: boolean;
}

export interface PlaygroundToolParam {
  name: string;
  label: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  type?: "string" | "boolean";
  helperText?: string;
}

export interface PlaygroundToolRequirements {
  oauthProvider: string;
  oauthConfigured: boolean;
  secretsConfigured: boolean;
  secrets: string[];
}

export interface PlaygroundToolDefinition {
  description: string;
  params: PlaygroundToolParam[];
  expectedOutput: string;
}

export interface PlaygroundPrompt {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  scenarioId: string;
}

export interface TraceScenarioStep {
  label: string;
  icon: "user" | "key" | "bolt" | "shield" | "check";
  delayMs: number;
}

export interface TraceScenario {
  id: string;
  toolAction: string;
  assistantResult: string;
  tracePreview: TracePreview;
  steps: TraceScenarioStep[];
  sdkSnippet: string;
}

export const PLAYGROUND_PROMPTS: PlaygroundPrompt[] = [
  {
    id: "gmail",
    brand: "Gmail",
    title: "Read my emails",
    subtitle: "and summarize them",
    scenarioId: "gmail-summarize",
  },
  {
    id: "slack",
    brand: "Slack",
    title: "Check Slack messages",
    subtitle: "in the #general channel",
    scenarioId: "slack-check",
  },
  {
    id: "github",
    brand: "GitHub",
    title: "Star the arcadeai/arcade-mcp",
    subtitle: "repo on GitHub",
    scenarioId: "github-star",
  },
  {
    id: "linkedin",
    brand: "LinkedIn",
    title: "Publish a new post on LinkedIn",
    subtitle: "saying that I'm testing Arcade.dev",
    scenarioId: "linkedin-post",
  },
  {
    id: "calendar",
    brand: "Calendar",
    title: "Check my schedule",
    subtitle: "for today on Google Calendar",
    scenarioId: "calendar-check",
  },
];

export const PLAYGROUND_TOOLS: PlaygroundTool[] = [
  { id: "t1", app: "Gmail", action: "Gmail.Search", category: "Communication", connected: true },
  { id: "t2", app: "Gmail", action: "Gmail.GetMessage", category: "Communication", connected: true },
  { id: "t3", app: "Slack", action: "Slack.ListChannels", category: "Communication", connected: true },
  { id: "t4", app: "Slack", action: "Slack.SendMessage", category: "Communication", connected: true, needsAuth: true },
  { id: "t5", app: "LinkedIn", action: "LinkedIn.CreatePost", category: "Communication", connected: true },
  { id: "t6", app: "Calendar", action: "Calendar.ListEvents", category: "Productivity", connected: true },
  { id: "t7", app: "GitHub", action: "GitHub.SetStarred", displayName: "SetStarred", version: "4.1.0", category: "DevOps", connected: true },
  { id: "t7b", app: "GitHub", action: "GitHub.StarRepo", category: "DevOps", connected: true },
  { id: "t8", app: "GitHub", action: "GitHub.CreateIssue", category: "DevOps", connected: true },
  { id: "t9", app: "Linear", action: "Linear.CreateIssue", category: "DevOps", connected: true },
  { id: "t10", app: "HubSpot", action: "HubSpot.SearchContacts", category: "CRM", connected: true, needsAuth: true },
  { id: "t11", app: "Salesforce", action: "Salesforce.UpdateRecord", category: "CRM", connected: true, needsAuth: true },
  { id: "t12", app: "Zendesk", action: "Zendesk.CreateTicket", category: "CRM", connected: true },
  { id: "t13", app: "Notion", action: "Notion.CreatePage", category: "Productivity", connected: true },
  { id: "t16", app: "Gmail", action: "Gmail.SendEmail", category: "Communication", connected: true },
  { id: "t17", app: "Gmail", action: "Gmail.CreateDraft", category: "Communication", connected: true },
  { id: "t18", app: "Slack", action: "Slack.GetMessages", category: "Communication", connected: true },
  { id: "t19", app: "Slack", action: "Slack.SetStatus", category: "Communication", connected: true },
  { id: "t20", app: "GitHub", action: "GitHub.ListPullRequests", category: "DevOps", connected: true },
  { id: "t21", app: "GitHub", action: "GitHub.MergePullRequest", category: "DevOps", connected: true, needsAuth: true },
  { id: "t22", app: "GitHub", action: "GitHub.AddComment", category: "DevOps", connected: true },
  { id: "t23", app: "Linear", action: "Linear.UpdateIssue", category: "DevOps", connected: true },
  { id: "t24", app: "Linear", action: "Linear.ListIssues", category: "DevOps", connected: true },
  { id: "t25", app: "Notion", action: "Notion.SearchPages", category: "Productivity", connected: true },
  { id: "t26", app: "Notion", action: "Notion.AppendBlock", category: "Productivity", connected: true },
  { id: "t27", app: "Asana", action: "Asana.CreateTask", category: "Productivity", connected: true },
  { id: "t28", app: "Asana", action: "Asana.ListTasks", category: "Productivity", connected: true },
  { id: "t29", app: "Calendar", action: "Calendar.CreateEvent", category: "Productivity", connected: true, needsAuth: true },
  { id: "t30", app: "Drive", action: "Drive.SearchFiles", category: "Productivity", connected: true },
  { id: "t31", app: "Drive", action: "Drive.UploadFile", category: "Productivity", connected: true },
  { id: "t32", app: "Dropbox", action: "Dropbox.ListFiles", category: "Productivity", connected: true },
  { id: "t33", app: "Figma", action: "Figma.GetFile", category: "Productivity", connected: true },
  { id: "t34", app: "Airtable", action: "Airtable.CreateRecord", category: "Productivity", connected: true },
  { id: "t35", app: "Airtable", action: "Airtable.ListRecords", category: "Productivity", connected: true },
  { id: "t36", app: "HubSpot", action: "HubSpot.CreateDeal", category: "CRM", connected: true },
  { id: "t37", app: "Salesforce", action: "Salesforce.CreateLead", category: "CRM", connected: true, needsAuth: true },
  { id: "t38", app: "Zendesk", action: "Zendesk.UpdateTicket", category: "CRM", connected: true },
  { id: "t39", app: "Intercom", action: "Intercom.SendMessage", category: "Communication", connected: true },
  { id: "t40", app: "Twilio", action: "Twilio.SendSMS", category: "Communication", connected: true },
  { id: "t41", app: "Stripe", action: "Stripe.CreateInvoice", category: "CRM", connected: true },
  { id: "t42", app: "Datadog", action: "Datadog.QueryMetrics", category: "DevOps", connected: true },
  { id: "t43", app: "MongoDB", action: "MongoDB.FindDocuments", category: "DevOps", connected: true },
  { id: "t44", app: "Snowflake", action: "Snowflake.RunQuery", category: "DevOps", connected: true },
  { id: "t14", app: "Jira", action: "Jira.CreateIssue", category: "DevOps", connected: false },
  { id: "t15", app: "Stripe", action: "Stripe.CreateRefund", category: "CRM", connected: false },
];

export const PLAYGROUND_TRACE_SCENARIOS: Record<string, TraceScenario> = {
  "gmail-summarize": {
    id: "gmail-summarize",
    toolAction: "Gmail.Search",
    assistantResult:
      "Found 12 unread emails. Summary: 3 from your team about the Q2 roadmap, 2 GitHub notifications, and 1 invoice from Stripe due Friday.",
    tracePreview: {
      userPrompt: "Read my emails and summarize them",
      agentReasoning: "User wants inbox summary — routing to Gmail search and message retrieval.",
      toolCalls: ["Gmail.Search", "Gmail.GetMessage"],
      result: "12 emails summarized · 3 action items flagged",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: Gmail.Search", icon: "bolt", delayMs: 600 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing Gmail.Search", icon: "bolt", delayMs: 1000 },
      { label: "Executing Gmail.GetMessage", icon: "bolt", delayMs: 700 },
      { label: "Success — 12 emails summarized", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "Gmail.Search",
  userId: "user_sambit",
  input: { query: "is:unread", maxResults: 20 },
});`,
  },
  "slack-check": {
    id: "slack-check",
    toolAction: "Slack.ListChannels",
    assistantResult:
      "Found 4 new messages in #general. Latest: Alex shared the deployment checklist. No mentions requiring your response.",
    tracePreview: {
      userPrompt: "Check Slack messages in the #general channel",
      agentReasoning: "Channel-scoped message check — listing channels then fetching history.",
      toolCalls: ["Slack.ListChannels", "Slack.GetMessages"],
      result: "4 messages retrieved from #general",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: Slack.ListChannels", icon: "bolt", delayMs: 600 },
      { label: "Policy check: channel read allowed", icon: "shield", delayMs: 700 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing Slack.GetMessages", icon: "bolt", delayMs: 900 },
      { label: "Success — 4 messages in #general", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "Slack.ListChannels",
  userId: "user_sambit",
  input: { types: "public_channel" },
});`,
  },
  "github-star": {
    id: "github-star",
    toolAction: "GitHub.SetStarred",
    assistantResult: "Starred arcadeai/arcade-mcp on GitHub. Your account now follows this repository.",
    tracePreview: {
      userPrompt: "Star the arcadeai/arcade-mcp repo on GitHub",
      agentReasoning: "Simple repo star action — verify OAuth scopes and execute.",
      toolCalls: ["GitHub.SetStarred"],
      result: "Repository starred successfully",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: GitHub.SetStarred", icon: "bolt", delayMs: 600 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing GitHub.SetStarred", icon: "bolt", delayMs: 1000 },
      { label: "Audit log saved", icon: "shield", delayMs: 400 },
      { label: "Success — repo starred", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "GitHub.SetStarred",
  userId: "user_sambit",
  input: { owner: "arcadeai", repo: "arcade-mcp" },
});`,
  },
  "linkedin-post": {
    id: "linkedin-post",
    toolAction: "LinkedIn.CreatePost",
    assistantResult:
      "Draft post created: \"Testing Arcade.dev — authorized tool calls with full trace visibility.\" Ready to publish when you confirm.",
    tracePreview: {
      userPrompt: "Publish a new post on LinkedIn saying that I'm testing Arcade.dev",
      agentReasoning: "Social post creation — policy requires draft review before publish.",
      toolCalls: ["LinkedIn.CreatePost"],
      result: "Draft created — awaiting publish confirmation",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: LinkedIn.CreatePost", icon: "bolt", delayMs: 600 },
      { label: "Policy check: social post allowed", icon: "shield", delayMs: 700 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing LinkedIn.CreatePost", icon: "bolt", delayMs: 900 },
      { label: "Success — draft created", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "LinkedIn.CreatePost",
  userId: "user_sambit",
  input: { text: "Testing Arcade.dev — authorized tool calls with full trace visibility." },
});`,
  },
  "calendar-check": {
    id: "calendar-check",
    toolAction: "Calendar.ListEvents",
    assistantResult:
      "You have 3 events today: Team standup at 10:00 AM, Product review at 2:00 PM, and 1:1 with Priya at 4:30 PM.",
    tracePreview: {
      userPrompt: "Check my schedule for today on Google Calendar",
      agentReasoning: "Calendar query for today's events — list and summarize.",
      toolCalls: ["Calendar.ListEvents"],
      result: "3 events found for today",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: Calendar.ListEvents", icon: "bolt", delayMs: 600 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing Calendar.ListEvents", icon: "bolt", delayMs: 1000 },
      { label: "Success — 3 events today", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "Calendar.ListEvents",
  userId: "user_sambit",
  input: { timeMin: "today", timeMax: "tomorrow" },
});`,
  },
  default: {
    id: "default",
    toolAction: "Gmail.Search",
    assistantResult:
      "Executed your request successfully. Check the trace panel for tool call details.",
    tracePreview: {
      userPrompt: "Custom prompt",
      agentReasoning: "Parsed user intent and selected the best matching tool.",
      toolCalls: ["Gmail.Search"],
      result: "Tool call completed successfully",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: Gmail.Search", icon: "bolt", delayMs: 600 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing tool call", icon: "bolt", delayMs: 1000 },
      { label: "Success", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "Gmail.Search",
  userId: "user_sambit",
  input: { query: "is:unread" },
});`,
  },
};

export const PLAYGROUND_HISTORY = [
  { id: "h1", label: "Email summary", time: "12 min ago", prompt: "Read my emails and summarize them" },
  { id: "h2", label: "GitHub star", time: "1 hr ago", prompt: "Star the arcadeai/arcade-mcp repo on GitHub" },
  { id: "h3", label: "Slack check", time: "Yesterday", prompt: "Check Slack messages in the #general channel" },
];

export const PLAYGROUND_STATUS = {
  toolsNeedAuth: 3,
  policiesActive: 2,
  environment: "Sandbox" as const,
};

export const PLAYGROUND_TOOL_DEFINITIONS: Record<string, PlaygroundToolDefinition> = {
  "Gmail.Search": {
    description: "Search Gmail messages using query syntax and return matching thread metadata.",
    params: [
      { name: "query", label: "query", required: true, placeholder: "is:unread", defaultValue: "is:unread" },
      { name: "maxResults", label: "maxResults", required: true, placeholder: "20", defaultValue: "20" },
    ],
    expectedOutput: "Array of message metadata objects with subject, sender, and snippet fields.",
  },
  "Gmail.GetMessage": {
    description: "Retrieve a single Gmail message by ID including headers and body content.",
    params: [
      { name: "messageId", label: "messageId", required: true, placeholder: "msg_abc123" },
      { name: "format", label: "format", required: true, placeholder: "full", defaultValue: "full" },
    ],
    expectedOutput: "Full message payload with headers, body, and attachment metadata.",
  },
  "Slack.ListChannels": {
    description: "List Slack channels visible to the authenticated user.",
    params: [
      { name: "types", label: "types", required: true, placeholder: "public_channel", defaultValue: "public_channel" },
      { name: "limit", label: "limit", required: true, placeholder: "50", defaultValue: "50" },
    ],
    expectedOutput: "Channel list with id, name, and membership status.",
  },
  "Slack.SendMessage": {
    description: "Post a message to a Slack channel on behalf of the connected user.",
    params: [
      { name: "channel", label: "channel", required: true, placeholder: "#general" },
      { name: "text", label: "text", required: true, placeholder: "Message body" },
    ],
    expectedOutput: "Message timestamp and channel confirmation object.",
  },
  "GitHub.SetStarred": {
    description: "Star or unstar a GitHub repository for the authenticated user.",
    params: [
      {
        name: "owner",
        label: "owner",
        required: true,
        placeholder: "arcadeai",
        defaultValue: "arcadeai",
        helperText: "The owner of the repository",
      },
      {
        name: "name",
        label: "name",
        required: true,
        placeholder: "arcade-mcp",
        defaultValue: "arcade-mcp",
        helperText: "The name of the repository",
      },
      {
        name: "starred",
        label: "starred",
        required: false,
        type: "boolean",
        defaultValue: "true",
        helperText: "Whether to star the repository or not. Default is True.",
      },
    ],
    expectedOutput: "Result of starring/unstarring operation",
  },
  "GitHub.StarRepo": {
    description: "Star a GitHub repository for the authenticated user account.",
    params: [
      { name: "owner", label: "owner", required: true, placeholder: "arcadeai", defaultValue: "arcadeai" },
      { name: "repo", label: "repo", required: true, placeholder: "arcade-mcp", defaultValue: "arcade-mcp" },
    ],
    expectedOutput: "204 No Content on success with audit log entry.",
  },
  "GitHub.CreateIssue": {
    description: "Create a new issue in a GitHub repository.",
    params: [
      { name: "owner", label: "owner", required: true, placeholder: "arcadeai" },
      { name: "repo", label: "repo", required: true, placeholder: "arcade-mcp" },
      { name: "title", label: "title", required: true, placeholder: "Issue title" },
    ],
    expectedOutput: "Created issue object with number, URL, and state.",
  },
};

const DEFAULT_TOOL_DEFINITION: PlaygroundToolDefinition = {
  description: "Execute a connected tool action with user-scoped authorization and policy checks.",
  params: [
    { name: "userId", label: "userId", required: true, placeholder: "user_sambit", defaultValue: "user_sambit" },
    { name: "input", label: "input", required: true, placeholder: "{}" },
  ],
  expectedOutput: "Tool-specific JSON response from the Arcade execution gateway.",
};

export function getPlaygroundToolDefinition(action: string): PlaygroundToolDefinition {
  return PLAYGROUND_TOOL_DEFINITIONS[action] ?? DEFAULT_TOOL_DEFINITION;
}

export function getPlaygroundToolMeta(action: string) {
  return PLAYGROUND_TOOLS.find((tool) => tool.action === action) ?? null;
}

export function scenarioForTool(toolAction: string): TraceScenario {
  const match = Object.values(PLAYGROUND_TRACE_SCENARIOS).find(
    (scenario) => scenario.toolAction === toolAction,
  );
  if (match) return match;
  return { ...PLAYGROUND_TRACE_SCENARIOS.default, toolAction };
}

export const PLAYGROUND_TOOL_REQUIREMENTS: Record<string, PlaygroundToolRequirements> = {
  "GitHub.SetStarred": {
    oauthProvider: "github",
    oauthConfigured: true,
    secretsConfigured: true,
    secrets: ["GITHUB_SERVER_URL"],
  },
  "GitHub.StarRepo": {
    oauthProvider: "github",
    oauthConfigured: true,
    secretsConfigured: true,
    secrets: ["GITHUB_SERVER_URL"],
  },
};

const DEFAULT_TOOL_REQUIREMENTS: PlaygroundToolRequirements = {
  oauthProvider: "oauth",
  oauthConfigured: true,
  secretsConfigured: true,
  secrets: [],
};

export function getPlaygroundToolRequirements(action: string): PlaygroundToolRequirements {
  return PLAYGROUND_TOOL_REQUIREMENTS[action] ?? DEFAULT_TOOL_REQUIREMENTS;
}

export type VisibilityStageId =
  | "intent"
  | "tool_selected"
  | "authorization"
  | "scope_check"
  | "policy_check"
  | "tool_execution"
  | "result"
  | "audit";

export interface VisibilityStageDef {
  id: VisibilityStageId;
  title: string;
  runningLabel: string;
  doneLabel: string;
  icon: "user" | "key" | "bolt" | "shield" | "check";
  durationMs: number;
}

export const EXECUTION_PIPELINE: VisibilityStageDef[] = [
  { id: "intent", title: "User intent received", runningLabel: "Parsing user intent", doneLabel: "User verified", icon: "user", durationMs: 600 },
  { id: "tool_selected", title: "Tool selected", runningLabel: "Selecting tool", doneLabel: "Tool selected", icon: "bolt", durationMs: 600 },
  { id: "authorization", title: "Authorization required", runningLabel: "Awaiting authorization", doneLabel: "User authorized", icon: "key", durationMs: 700 },
  { id: "scope_check", title: "Scope check", runningLabel: "Verifying scopes", doneLabel: "Scopes approved", icon: "key", durationMs: 600 },
  { id: "policy_check", title: "Policy check", runningLabel: "Evaluating policy", doneLabel: "Policy passed", icon: "shield", durationMs: 600 },
  { id: "tool_execution", title: "Tool execution", runningLabel: "Executing tool", doneLabel: "Tool executed", icon: "bolt", durationMs: 900 },
  { id: "result", title: "Result returned", runningLabel: "Returning result", doneLabel: "Result returned", icon: "check", durationMs: 600 },
  { id: "audit", title: "Audit log saved", runningLabel: "Writing audit log", doneLabel: "Trace saved", icon: "shield", durationMs: 500 },
];

export interface ExecutionAuth {
  user: string;
  provider: string;
  scopes: string[];
  requiresAuth: boolean;
}

export const EXECUTION_DEFAULT_USER = "Alex Morgan";

const TOOL_SCOPES: Record<string, string[]> = {
  "GitHub.CreateIssue": ["repo:read", "issues:write"],
  "GitHub.SetStarred": ["repo:read", "user:follow"],
  "GitHub.StarRepo": ["repo:read", "user:follow"],
  "Gmail.Search": ["gmail.readonly"],
  "Gmail.GetMessage": ["gmail.readonly"],
  "Slack.ListChannels": ["channels:read"],
  "Slack.SendMessage": ["chat:write", "channels:read"],
  "LinkedIn.CreatePost": ["w_member_social"],
  "Calendar.ListEvents": ["calendar.events.readonly"],
  "Linear.CreateIssue": ["issues:create"],
  "Notion.CreatePage": ["pages:write"],
  "HubSpot.SearchContacts": ["crm.objects.contacts.read"],
  "Salesforce.UpdateRecord": ["api", "refresh_token"],
  "Zendesk.CreateTicket": ["tickets:write"],
  "Jira.CreateIssue": ["write:jira-work"],
  "Stripe.CreateRefund": ["refunds:write"],
};

export function getExecutionAuth(toolAction: string): ExecutionAuth {
  const meta = getPlaygroundToolMeta(toolAction);
  const provider = meta?.app ?? toolAction.split(".")[0] ?? "provider";
  const scopes = TOOL_SCOPES[toolAction] ?? ["read", "write"];
  return { user: EXECUTION_DEFAULT_USER, provider, scopes, requiresAuth: true };
}

export function getToolDisplayName(action: string): string {
  const meta = getPlaygroundToolMeta(action);
  if (meta?.displayName) return meta.displayName;
  const parts = action.split(".");
  return parts[parts.length - 1] ?? action;
}

export function getDefaultExecuteTool(): string {
  return "GitHub.SetStarred";
}

export function getDefaultConnectedTool(): string {
  return PLAYGROUND_TOOLS.find((tool) => tool.connected)?.action ?? "Gmail.Search";
}

export function getPlaygroundToolCounts() {
  const connected = PLAYGROUND_TOOLS.filter((t) => t.connected).length;
  const catalog = 151;
  const connectedActive = 64;
  const catalogOnly = catalog - connectedActive;
  return { connectedActive, catalogOnly, catalog, panelConnected: connected };
}

export function matchScenario(message: string): TraceScenario {
  const lower = message.toLowerCase();
  if (lower.includes("email") || lower.includes("gmail")) {
    return PLAYGROUND_TRACE_SCENARIOS["gmail-summarize"];
  }
  if (lower.includes("slack")) {
    return PLAYGROUND_TRACE_SCENARIOS["slack-check"];
  }
  if (lower.includes("github") || lower.includes("star")) {
    return PLAYGROUND_TRACE_SCENARIOS["github-star"];
  }
  if (lower.includes("linkedin") || lower.includes("post")) {
    return PLAYGROUND_TRACE_SCENARIOS["linkedin-post"];
  }
  if (lower.includes("calendar") || lower.includes("schedule")) {
    return PLAYGROUND_TRACE_SCENARIOS["calendar-check"];
  }
  return PLAYGROUND_TRACE_SCENARIOS.default;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "All",
  "Communication",
  "CRM",
  "DevOps",
  "Productivity",
];
