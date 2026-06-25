// Goal-aware seeding + a lightweight, deterministic "agent brain" for the
// Playground. When a user picks an onboarding goal, the Playground opens with a
// contextual greeting and answers follow-up questions with detailed, mock —
// but logic-driven — breakdowns based on the connected tools for that goal.

export interface GoalSuggestion {
  label: string;
  prompt: string;
  brand?: string;
  sub?: string;
}

export interface GoalSeedTool {
  name: string;
  connected: boolean;
}

export interface GoalSeed {
  id: string;
  title: string;
  agentTitle: string;
  tools: GoalSeedTool[];
  greeting: string;
  suggestions: GoalSuggestion[];
}

export interface GoalReply {
  content: string;
  toolAction: string;
  toolCalls: string[];
  reasoning: string;
  result: string;
}

interface Responder {
  match: (lower: string) => boolean;
  build: () => GoalReply;
}

const has =
  (...keywords: string[]) =>
  (lower: string) =>
    keywords.some((k) => lower.includes(k));

/* ─── Mock knowledge base (per goal) ─────────────────────────────── */

const PLAN_EVENTS = [
  "10:00–10:30   Team standup",
  "14:00–15:00   Product review (prep needed)",
  "16:30–17:00   1:1 with Priya",
];

const TRIAGE_ISSUES = [
  { id: "#482", title: "Login crash on Safari 17", priority: "High", label: "bug", route: "Auth squad" },
  { id: "#477", title: "Dashboard slow with 10k+ rows", priority: "Medium", label: "performance", route: "Platform" },
  { id: "#479", title: "Typo in README quickstart", priority: "Low", label: "docs", route: "DevRel" },
  { id: "#475", title: "Feature request: dark mode", priority: "Low", label: "enhancement", route: "Backlog" },
];

/* ─── Reply builders ─────────────────────────────────────────────── */

const planBrief = (): GoalReply => ({
  content: [
    "Here's your day, pulled from Google Calendar and Gmail:",
    "",
    "SCHEDULE — 3 events",
    ...PLAN_EVENTS.map((e) => `• ${e}`),
    "",
    "NEEDS A REPLY — 2 priority emails",
    '• "Q2 roadmap sign-off" — reply requested before 2:00 PM',
    "• Stripe invoice — due Friday",
    "",
    "SUGGESTED PLAN",
    "• 11:00–13:00  Focus block (no meetings) — prep the product review here",
    "• 13:30  Reply to the roadmap thread before the 2:00 PM review",
    "• 17:00  Clear remaining inbox (9 unread, mostly low priority)",
    "",
    "Want me to draft the roadmap reply or block that focus time on your calendar?",
  ].join("\n"),
  toolAction: "Calendar.ListEvents",
  toolCalls: ["Calendar.ListEvents", "Gmail.Search"],
  reasoning: "Daily brief — pulled today's events and ranked unread mail by urgency.",
  result: "3 events + 2 priority emails → prioritized day plan",
});

const planFreeSlot = (): GoalReply => ({
  content: [
    "Looking across today's calendar, here are your open slots:",
    "",
    "• 09:00–10:00   (1 hr)",
    "• 11:00–13:00   (2 hr — best for deep work)",
    "• 15:00–16:30   (1.5 hr)",
    "",
    "The 11:00–13:00 block is your longest uninterrupted window. Want me to hold it as a focus block?",
  ].join("\n"),
  toolAction: "Calendar.ListEvents",
  toolCalls: ["Calendar.ListEvents"],
  reasoning: "Computed gaps between today's scheduled events.",
  result: "3 free windows found",
});

const planDraftReply = (): GoalReply => ({
  content: [
    "Draft reply to \"Q2 roadmap sign-off\":",
    "",
    "  Hi team — reviewed the roadmap. I'm aligned on the Q2",
    "  priorities; one note: let's pull the auth hardening work",
    "  ahead of the dashboard perf track. Approving so we can",
    "  lock scope in today's 2:00 PM review.",
    "",
    "Drafted in Gmail — not sent. Reply \"send it\" and I'll deliver it on your behalf.",
  ].join("\n"),
  toolAction: "Gmail.GetMessage",
  toolCalls: ["Gmail.Search", "Gmail.GetMessage"],
  reasoning: "Located the roadmap thread and composed a context-aware draft.",
  result: "Draft created — awaiting confirmation",
});

const triageBoard = (): GoalReply => ({
  content: [
    "Triaged 4 inbound issues from GitHub. Proposed routing:",
    "",
    ...TRIAGE_ISSUES.flatMap((i) => [
      `${i.id}  ${i.title}`,
      `   priority: ${i.priority} · label: ${i.label} · route: ${i.route}`,
    ]),
    "",
    "RECOMMENDED NEXT STEPS",
    "• Escalate #482 (Safari login crash) — affects sign-in, mirror to Linear for the Auth squad",
    "• Post a heads-up in #eng-triage for #482 and #477",
    "• Auto-close #479 with a docs fix PR",
    "",
    "Say \"escalate 482\" to open the Linear issue and notify the team.",
  ].join("\n"),
  toolAction: "GitHub.CreateIssue",
  toolCalls: ["GitHub.ListIssues", "Linear.CreateIssue", "Slack.SendMessage"],
  reasoning: "Classified open issues by severity and mapped each to an owning team.",
  result: "4 issues triaged · 1 high-priority escalation flagged",
});

const triageEscalate = (): GoalReply => ({
  content: [
    "Escalating #482 — Login crash on Safari 17:",
    "",
    "• Created Linear issue AUTH-216 (priority: Urgent), assigned to Auth squad",
    "• Linked back to GitHub #482",
    '• Drafted Slack post to #eng-triage: "Heads up: Safari 17 login crash (gh#482 / AUTH-216), investigating now."',
    "",
    "All set on the sandbox. Want me to send the Slack message and add the on-call as a watcher?",
  ].join("\n"),
  toolAction: "Linear.CreateIssue",
  toolCalls: ["Linear.CreateIssue", "Slack.SendMessage"],
  reasoning: "High-severity bug — created a tracked Linear issue and prepared a team notification.",
  result: "Linear AUTH-216 created · Slack draft ready",
});

const inboxSummary = (): GoalReply => ({
  content: [
    "Here's your inbox, grouped and ranked across Gmail + Slack:",
    "",
    "NEEDS ACTION — 3",
    '• "Q2 roadmap sign-off" (team) — reply before 2:00 PM',
    "• Stripe invoice #INV-2042 — due Friday",
    '• Slack DM from Alex — "can you review the deploy checklist?"',
    "",
    "FYI — 5",
    "• 2 GitHub notifications (CI passed on main)",
    "• 3 newsletters (batched)",
    "",
    "NO ACTION — 4 promotions auto-archived",
    "",
    "Want me to draft replies to the 3 action items, or just the roadmap one?",
  ].join("\n"),
  toolAction: "Gmail.Search",
  toolCalls: ["Gmail.Search", "Slack.ListChannels"],
  reasoning: "Fetched unread mail + recent Slack, then clustered by required action.",
  result: "12 items triaged · 3 need a reply",
});

const inboxDraft = (): GoalReply => ({
  content: [
    "Drafted a reply to Alex's deploy-checklist DM:",
    "",
    "  Reviewed the checklist — looks solid. One add: run the",
    "  smoke test against staging before the prod promote. Good",
    "  to go after that.",
    "",
    "Saved as a Slack draft. Reply \"send\" to post it.",
  ].join("\n"),
  toolAction: "Slack.SendMessage",
  toolCalls: ["Slack.SendMessage"],
  reasoning: "Composed a concise, on-topic reply to the highest-priority message.",
  result: "Draft ready — awaiting confirmation",
});

const toolGeneric = (): GoalReply => ({
  content: [
    "You're connected to GitHub, Slack, and Gmail in the sandbox.",
    "Tell me an action and I'll run it as one authorized tool call, e.g.:",
    "",
    "• \"create a GitHub issue in arcadeai/arcade titled 'flaky test'\"",
    "• \"search my Gmail for invoices from this month\"",
    "• \"post 'deploy done' to #general in Slack\"",
    "",
    "Each call shows the full trace: intent → tool → auth → policy → result.",
  ].join("\n"),
  toolAction: "GitHub.CreateIssue",
  toolCalls: ["GitHub.CreateIssue"],
  reasoning: "No specific action yet — offered concrete, runnable examples.",
  result: "Awaiting an action to execute",
});

const codeGeneric = (): GoalReply => ({
  content: [
    "Here's how the same call looks from your own backend:",
    "",
    "  const result = await client.tools.execute({",
    '    tool: "GitHub.CreateIssue",',
    '    userId: "user_sambit",',
    '    input: { owner: "arcadeai", repo: "arcade", title: "Flaky test" },',
    "  });",
    "",
    "execute() checks the user's auth, runs policy, calls the provider, and",
    "returns the response — the exact flow you see in the trace panel here.",
    "Ask me to show the LangChain or Vercel AI SDK version.",
  ].join("\n"),
  toolAction: "GitHub.CreateIssue",
  toolCalls: ["GitHub.CreateIssue"],
  reasoning: "Developer goal — mapped the playground action to SDK code.",
  result: "SDK snippet generated",
});

/* ─── Goal seeds ─────────────────────────────────────────────────── */

export const GOAL_SEEDS: Record<string, GoalSeed> = {
  plan: {
    id: "plan",
    title: "Plan my day",
    agentTitle: "Daily Planner",
    tools: [
      { name: "Calendar", connected: true },
      { name: "Gmail", connected: true },
    ],
    greeting: [
      "Connected via MCP: Google Calendar, Gmail.",
      "",
      planBrief().content,
    ].join("\n"),
    suggestions: [
      { label: "Find me a free slot today", prompt: "Find me a free 2-hour slot today", brand: "Calendar", sub: "a 2-hour block today" },
      { label: "Draft the roadmap reply", prompt: "Draft a reply to the Q2 roadmap email", brand: "Gmail", sub: "to the Q2 roadmap email" },
      { label: "What's most urgent?", prompt: "What should I do first today?", brand: "Calendar", sub: "ranked for today" },
    ],
  },
  triage: {
    id: "triage",
    title: "Triage inbound issues",
    agentTitle: "Issue Triager",
    tools: [
      { name: "GitHub", connected: true },
      { name: "Linear", connected: true },
      { name: "Slack", connected: true },
    ],
    greeting: [
      "Connected via MCP: GitHub, Linear, Slack.",
      "",
      triageBoard().content,
    ].join("\n"),
    suggestions: [
      { label: "Escalate the Safari crash", prompt: "Escalate issue 482 to Linear and notify the team", brand: "Linear", sub: "issue 482 to Linear" },
      { label: "Summarize by severity", prompt: "Group the open issues by severity", brand: "GitHub", sub: "group the open issues" },
      { label: "Draft a Slack update", prompt: "Draft a Slack update for #eng-triage", brand: "Slack", sub: "for #eng-triage" },
    ],
  },
  inbox: {
    id: "inbox",
    title: "Stay on top of inbox",
    agentTitle: "Inbox Assistant",
    tools: [
      { name: "Gmail", connected: true },
      { name: "Slack", connected: true },
    ],
    greeting: [
      "Connected via MCP: Gmail, Slack.",
      "",
      inboxSummary().content,
    ].join("\n"),
    suggestions: [
      { label: "Draft my replies", prompt: "Draft replies to the action items", brand: "Gmail", sub: "to your action items" },
      { label: "What needs a reply?", prompt: "What in my inbox needs a reply today?", brand: "Gmail", sub: "in your inbox today" },
      { label: "Summarize Slack", prompt: "Summarize my unread Slack messages", brand: "Slack", sub: "your unread messages" },
    ],
  },
  tool: {
    id: "tool",
    title: "Start from a tool",
    agentTitle: "Tool Runner",
    tools: [
      { name: "GitHub", connected: true },
      { name: "Slack", connected: true },
      { name: "Gmail", connected: true },
    ],
    greeting: [
      "Connected via MCP: GitHub, Slack, Gmail.",
      "",
      toolGeneric().content,
    ].join("\n"),
    suggestions: [
      { label: "Create a GitHub issue", prompt: "Create a GitHub issue in arcadeai/arcade titled 'flaky test'", brand: "GitHub", sub: "in arcadeai/arcade" },
      { label: "Search my Gmail", prompt: "Search my Gmail for invoices from this month", brand: "Gmail", sub: "for this month's invoices" },
      { label: "Post to Slack", prompt: "Post 'deploy done' to #general in Slack", brand: "Slack", sub: "to #general" },
    ],
  },
  code: {
    id: "code",
    title: "Start from code",
    agentTitle: "SDK Helper",
    tools: [
      { name: "LangChain", connected: true },
      { name: "OpenAI", connected: true },
    ],
    greeting: [
      "You're set up to call Arcade from your own agent.",
      "",
      codeGeneric().content,
    ].join("\n"),
    suggestions: [
      { label: "Show the LangChain version", prompt: "Show the LangChain version of this call", brand: "LangChain", sub: "of this tool call" },
      { label: "How does auth work?", prompt: "How does execute() handle user auth?", brand: "OpenAI", sub: "with execute()" },
      { label: "Run a sample call", prompt: "Create a GitHub issue titled 'flaky test'", brand: "GitHub", sub: "create a test issue" },
    ],
  },
};

/* ─── Responder tables ───────────────────────────────────────────── */

const RESPONDERS: Record<string, Responder[]> = {
  plan: [
    { match: has("free", "slot", "availability", "available", "open time"), build: planFreeSlot },
    { match: has("draft", "reply", "respond", "write"), build: planDraftReply },
    { match: has("plan", "day", "schedule", "today", "brief", "first", "urgent", "priorit"), build: planBrief },
    { match: () => true, build: planBrief },
  ],
  triage: [
    { match: has("escalate", "482", "safari", "crash", "urgent"), build: triageEscalate },
    { match: has("slack", "notify", "update", "post"), build: () => triageEscalate() },
    { match: has("triage", "issue", "bug", "severity", "group", "inbound", "summar"), build: triageBoard },
    { match: () => true, build: triageBoard },
  ],
  inbox: [
    { match: has("draft", "reply", "respond", "write"), build: inboxDraft },
    { match: has("slack"), build: () => inboxDraft() },
    { match: has("inbox", "email", "mail", "summar", "reply", "action", "unread"), build: inboxSummary },
    { match: () => true, build: inboxSummary },
  ],
  tool: [
    { match: () => true, build: toolGeneric },
  ],
  code: [
    { match: () => true, build: codeGeneric },
  ],
};

export function getGoalSeed(goalId: string | null): GoalSeed | null {
  if (!goalId) return null;
  return GOAL_SEEDS[goalId] ?? null;
}

export function generateGoalReply(goalId: string | null, message: string): GoalReply {
  const lower = message.toLowerCase();
  const key = goalId && RESPONDERS[goalId] ? goalId : "tool";
  const responders = RESPONDERS[key];
  const responder = responders.find((r) => r.match(lower)) ?? responders[responders.length - 1];
  return responder.build();
}
