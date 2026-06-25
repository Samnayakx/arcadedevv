import type { TracePreview } from "../types";

export type ToolCategory = "Communication" | "CRM" | "DevOps" | "Productivity" | "All";

export interface PlaygroundTool {
  id: string;
  app: string;
  action: string;
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
  { id: "t7", app: "GitHub", action: "GitHub.StarRepo", category: "DevOps", connected: true },
  { id: "t8", app: "GitHub", action: "GitHub.CreateIssue", category: "DevOps", connected: true },
  { id: "t9", app: "Linear", action: "Linear.CreateIssue", category: "DevOps", connected: true },
  { id: "t10", app: "HubSpot", action: "HubSpot.SearchContacts", category: "CRM", connected: true, needsAuth: true },
  { id: "t11", app: "Salesforce", action: "Salesforce.UpdateRecord", category: "CRM", connected: true, needsAuth: true },
  { id: "t12", app: "Zendesk", action: "Zendesk.CreateTicket", category: "CRM", connected: true },
  { id: "t13", app: "Notion", action: "Notion.CreatePage", category: "Productivity", connected: true },
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
    toolAction: "GitHub.StarRepo",
    assistantResult: "Starred arcadeai/arcade-mcp on GitHub. Your account now follows this repository.",
    tracePreview: {
      userPrompt: "Star the arcadeai/arcade-mcp repo on GitHub",
      agentReasoning: "Simple repo star action — verify OAuth scopes and execute.",
      toolCalls: ["GitHub.StarRepo"],
      result: "Repository starred successfully",
    },
    steps: [
      { label: "Thinking…", icon: "user", delayMs: 400 },
      { label: "Selecting tool: GitHub.StarRepo", icon: "bolt", delayMs: 600 },
      { label: "Authenticating user", icon: "key", delayMs: 800 },
      { label: "Executing GitHub.StarRepo", icon: "bolt", delayMs: 1000 },
      { label: "Audit log saved", icon: "shield", delayMs: 400 },
      { label: "Success — repo starred", icon: "check", delayMs: 500 },
    ],
    sdkSnippet: `const result = await client.tools.execute({
  tool: "GitHub.StarRepo",
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
