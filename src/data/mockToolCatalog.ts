export type CatalogCategory =
  | "Productivity"
  | "Developer"
  | "Communication"
  | "Data"
  | "Research";

export type CatalogFilter =
  | "all"
  | "connected"
  | "productivity"
  | "developer"
  | "communication"
  | "data"
  | "research"
  | "slack-teams"
  | "arcade"
  | "computer";

export type CatalogAuthType = "OAuth" | "Secrets";

export interface CatalogIntegration {
  id: string;
  app: string;
  name: string;
  version: string;
  description: string;
  category: CatalogCategory;
  authType: CatalogAuthType;
  toolCount: number;
  tools: string[];
  connected: boolean;
  tags?: Array<"slack-teams" | "arcade" | "computer">;
}

export const CATALOG_INTEGRATIONS: CatalogIntegration[] = [
  {
    id: "airtable",
    app: "Airtable",
    name: "Airtable API",
    version: "v0.4.1",
    description: "Tools that enable LLMs to interact directly with the Airtable API.",
    category: "Data",
    authType: "Secrets",
    toolCount: 96,
    tools: ["Airtable.ListBases", "Airtable.ListRecords", "Airtable.CreateRecord", "Airtable.UpdateRecord"],
    connected: false,
  },
  {
    id: "apollo",
    app: "Apollo",
    name: "Apollo",
    version: "v0.1.0",
    description: "Tools that enable LLMs to enrich contacts and search company data via Apollo.",
    category: "Research",
    authType: "Secrets",
    toolCount: 5,
    tools: ["Apollo.SearchPeople", "Apollo.EnrichContact", "Apollo.SearchCompanies"],
    connected: false,
  },
  {
    id: "arcade-engine",
    app: "Arcade",
    name: "Arcade Engine API",
    version: "v0.3.0",
    description: "Tools that enable LLMs to execute Arcade tool calls with full trace visibility.",
    category: "Developer",
    authType: "Secrets",
    toolCount: 29,
    tools: ["Arcade.ExecuteTool", "Arcade.ListTools", "Arcade.GetTrace", "Arcade.ValidatePolicy"],
    connected: true,
    tags: ["arcade"],
  },
  {
    id: "asana",
    app: "Asana",
    name: "Asana",
    version: "v1.2.2",
    description: "Tools that enable LLMs to manage tasks, projects, and assignments in Asana.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 19,
    tools: ["Asana.CreateTask", "Asana.ListProjects", "Asana.UpdateTask", "Asana.AddComment"],
    connected: false,
  },
  {
    id: "asana-api",
    app: "Asana",
    name: "Asana API",
    version: "v0.2.1",
    description: "Tools that enable LLMs to interact directly with the Asana REST API.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 199,
    tools: ["Asana.GetTask", "Asana.SearchTasks", "Asana.CreateSubtask", "Asana.GetUser"],
    connected: false,
  },
  {
    id: "ashby",
    app: "Ashby",
    name: "Ashby",
    version: "v0.1.4",
    description: "Tools that enable LLMs to manage candidates, jobs, and recruiting pipelines.",
    category: "Research",
    authType: "OAuth",
    toolCount: 12,
    tools: ["Ashby.ListCandidates", "Ashby.CreateApplication", "Ashby.UpdateJob"],
    connected: false,
  },
  {
    id: "calendar",
    app: "Calendar",
    name: "Google Calendar",
    version: "v1.0.3",
    description: "Tools that enable LLMs to list events, check availability, and schedule meetings.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 14,
    tools: ["Calendar.ListEvents", "Calendar.CreateEvent", "Calendar.GetFreeBusy"],
    connected: true,
  },
  {
    id: "datadog",
    app: "Datadog",
    name: "Datadog",
    version: "v0.2.0",
    description: "Tools that enable LLMs to query metrics, logs, and monitors in Datadog.",
    category: "Developer",
    authType: "Secrets",
    toolCount: 22,
    tools: ["Datadog.QueryMetrics", "Datadog.SearchLogs", "Datadog.ListMonitors"],
    connected: false,
  },
  {
    id: "dropbox",
    app: "Dropbox",
    name: "Dropbox",
    version: "v0.3.2",
    description: "Tools that enable LLMs to browse, upload, and share files in Dropbox.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 18,
    tools: ["Dropbox.ListFolder", "Dropbox.UploadFile", "Dropbox.CreateSharedLink"],
    connected: false,
  },
  {
    id: "exa",
    app: "Exa",
    name: "Exa",
    version: "v0.1.8",
    description: "Tools that enable LLMs to run web and research queries with structured citations.",
    category: "Research",
    authType: "Secrets",
    toolCount: 4,
    tools: ["Exa.Search", "Exa.FindSimilar", "Exa.GetContents"],
    connected: false,
  },
  {
    id: "figma",
    app: "Figma",
    name: "Figma",
    version: "v0.2.5",
    description: "Tools that enable LLMs to read files, components, and design tokens from Figma.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 11,
    tools: ["Figma.GetFile", "Figma.ListComponents", "Figma.ExportAssets"],
    connected: false,
  },
  {
    id: "gmail",
    app: "Gmail",
    name: "Gmail",
    version: "v1.1.0",
    description: "Tools that enable LLMs to read, search, and send email on behalf of users.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 24,
    tools: ["Gmail.Search", "Gmail.GetMessage", "Gmail.SendMessage", "Gmail.ListLabels"],
    connected: true,
  },
  {
    id: "bigquery",
    app: "Google",
    name: "Google BigQuery",
    version: "v0.5.0",
    description: "Tools that enable LLMs to query datasets and return structured results.",
    category: "Data",
    authType: "OAuth",
    toolCount: 31,
    tools: ["BigQuery.RunQuery", "BigQuery.ListDatasets", "BigQuery.GetTable"],
    connected: false,
  },
  {
    id: "docs",
    app: "Google",
    name: "Google Docs",
    version: "v0.3.1",
    description: "Tools that enable LLMs to create and update documents from agent workflows.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 16,
    tools: ["Docs.CreateDocument", "Docs.AppendText", "Docs.GetDocument"],
    connected: false,
  },
  {
    id: "sheets",
    app: "Google",
    name: "Google Sheets",
    version: "v0.4.0",
    description: "Tools that enable LLMs to read and write spreadsheet data for reporting agents.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 28,
    tools: ["Sheets.GetValues", "Sheets.UpdateValues", "Sheets.CreateSpreadsheet"],
    connected: false,
  },
  {
    id: "github",
    app: "GitHub",
    name: "GitHub",
    version: "v2.0.1",
    description: "Tools that enable LLMs to interact directly with the GitHub API.",
    category: "Developer",
    authType: "OAuth",
    toolCount: 87,
    tools: ["GitHub.SetStarred", "GitHub.StarRepo", "GitHub.CreateIssue", "GitHub.ListPullRequests", "GitHub.GetFile"],
    connected: true,
  },
  {
    id: "hubspot",
    app: "HubSpot",
    name: "HubSpot",
    version: "v0.6.2",
    description: "Tools that enable LLMs to search contacts, deals, and CRM records in HubSpot.",
    category: "Data",
    authType: "OAuth",
    toolCount: 42,
    tools: ["HubSpot.SearchContacts", "HubSpot.CreateDeal", "HubSpot.UpdateContact"],
    connected: false,
  },
  {
    id: "intercom",
    app: "Intercom",
    name: "Intercom",
    version: "v0.1.6",
    description: "Tools that enable LLMs to read conversations and update customer records.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 15,
    tools: ["Intercom.ListConversations", "Intercom.ReplyToConversation", "Intercom.GetContact"],
    connected: false,
  },
  {
    id: "jira",
    app: "Jira",
    name: "Jira",
    version: "v1.3.0",
    description: "Tools that enable LLMs to create issues, update status, and search Jira projects.",
    category: "Developer",
    authType: "OAuth",
    toolCount: 54,
    tools: ["Jira.CreateIssue", "Jira.SearchIssues", "Jira.TransitionIssue", "Jira.AddComment"],
    connected: false,
  },
  {
    id: "linear",
    app: "Linear",
    name: "Linear",
    version: "v0.8.4",
    description: "Tools that enable LLMs to create issues, update status, and triage engineering work.",
    category: "Developer",
    authType: "OAuth",
    toolCount: 26,
    tools: ["Linear.CreateIssue", "Linear.UpdateIssue", "Linear.ListTeams", "Linear.SearchIssues"],
    connected: true,
  },
  {
    id: "linkedin",
    app: "LinkedIn",
    name: "LinkedIn",
    version: "v0.2.3",
    description: "Tools that enable LLMs to draft and publish posts with policy-aware review steps.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 8,
    tools: ["LinkedIn.CreatePost", "LinkedIn.GetProfile", "LinkedIn.ListConnections"],
    connected: true,
  },
  {
    id: "excel",
    app: "Microsoft",
    name: "Excel",
    version: "v0.4.2",
    description: "Tools that enable LLMs to work with workbooks, ranges, and tabular business data.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 33,
    tools: ["Excel.GetRange", "Excel.UpdateRange", "Excel.CreateWorkbook"],
    connected: false,
  },
  {
    id: "outlook",
    app: "Microsoft",
    name: "Outlook",
    version: "v1.0.1",
    description: "Tools that enable LLMs to search inbox, draft messages, and manage mail threads.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 21,
    tools: ["Outlook.SearchMail", "Outlook.SendMail", "Outlook.ListFolders"],
    connected: false,
  },
  {
    id: "sharepoint",
    app: "Microsoft",
    name: "Sharepoint",
    version: "v0.3.4",
    description: "Tools that enable LLMs to access sites, lists, and files across your workspace.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 37,
    tools: ["Sharepoint.ListSites", "Sharepoint.GetFile", "Sharepoint.UploadFile"],
    connected: false,
  },
  {
    id: "teams",
    app: "Microsoft",
    name: "Teams",
    version: "v0.5.1",
    description: "Tools that enable LLMs to post messages, read channels, and coordinate in Teams.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 19,
    tools: ["Teams.SendMessage", "Teams.ListChannels", "Teams.GetChatMessages"],
    connected: false,
    tags: ["slack-teams"],
  },
  {
    id: "word",
    app: "Microsoft",
    name: "Word",
    version: "v0.2.8",
    description: "Tools that enable LLMs to create and edit documents for approval workflows.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 14,
    tools: ["Word.CreateDocument", "Word.AppendParagraph", "Word.GetDocument"],
    connected: false,
  },
  {
    id: "mongodb",
    app: "MongoDB",
    name: "MongoDB",
    version: "v0.1.2",
    description: "Tools that enable LLMs to query collections and run aggregation pipelines.",
    category: "Data",
    authType: "Secrets",
    toolCount: 9,
    tools: ["MongoDB.Find", "MongoDB.InsertOne", "MongoDB.Aggregate"],
    connected: false,
  },
  {
    id: "notion",
    app: "Notion",
    name: "Notion",
    version: "v0.7.0",
    description: "Tools that enable LLMs to create pages, query databases, and update blocks.",
    category: "Productivity",
    authType: "OAuth",
    toolCount: 23,
    tools: ["Notion.CreatePage", "Notion.QueryDatabase", "Notion.AppendBlock"],
    connected: false,
  },
  {
    id: "openai",
    app: "OpenAI",
    name: "OpenAI",
    version: "v1.4.0",
    description: "Tools that enable LLMs to call models, manage assistants, and run evaluations.",
    category: "Developer",
    authType: "Secrets",
    toolCount: 12,
    tools: ["OpenAI.CreateCompletion", "OpenAI.ListModels", "OpenAI.CreateEmbedding"],
    connected: false,
  },
  {
    id: "pylon",
    app: "Pylon",
    name: "Pylon",
    version: "v0.1.1",
    description: "Tools that enable LLMs to sync customer conversations and support ticket context.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 7,
    tools: ["Pylon.ListIssues", "Pylon.GetAccount", "Pylon.CreateNote"],
    connected: false,
  },
  {
    id: "salesforce",
    app: "Salesforce",
    name: "Salesforce",
    version: "v2.1.0",
    description: "Tools that enable LLMs to query records, update opportunities, and log CRM activity.",
    category: "Data",
    authType: "OAuth",
    toolCount: 112,
    tools: ["Salesforce.Query", "Salesforce.UpdateRecord", "Salesforce.CreateLead"],
    connected: false,
  },
  {
    id: "slack",
    app: "Slack",
    name: "Slack",
    version: "v1.5.2",
    description: "Tools that enable LLMs to send messages, list channels, and monitor team updates.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 45,
    tools: ["Slack.SendMessage", "Slack.ListChannels", "Slack.GetMessages", "Slack.AddReaction"],
    connected: true,
    tags: ["slack-teams"],
  },
  {
    id: "snowflake",
    app: "Snowflake",
    name: "Snowflake",
    version: "v0.3.3",
    description: "Tools that enable LLMs to run SQL queries and inspect warehouse metadata.",
    category: "Data",
    authType: "Secrets",
    toolCount: 17,
    tools: ["Snowflake.ExecuteQuery", "Snowflake.ListTables", "Snowflake.DescribeTable"],
    connected: false,
  },
  {
    id: "stripe",
    app: "Stripe",
    name: "Stripe",
    version: "v0.9.1",
    description: "Tools that enable LLMs to manage payments, refunds, and subscription billing.",
    category: "Data",
    authType: "Secrets",
    toolCount: 38,
    tools: ["Stripe.CreateRefund", "Stripe.ListCustomers", "Stripe.CreateInvoice"],
    connected: false,
  },
  {
    id: "tavily",
    app: "Tavily",
    name: "Tavily",
    version: "v0.2.0",
    description: "Tools that enable LLMs to search the web and return concise cited answers.",
    category: "Research",
    authType: "Secrets",
    toolCount: 3,
    tools: ["Tavily.Search", "Tavily.Extract"],
    connected: false,
  },
  {
    id: "twilio",
    app: "Twilio",
    name: "Twilio",
    version: "v0.4.4",
    description: "Tools that enable LLMs to send SMS, place calls, and manage messaging workflows.",
    category: "Communication",
    authType: "Secrets",
    toolCount: 20,
    tools: ["Twilio.SendSMS", "Twilio.ListMessages", "Twilio.MakeCall"],
    connected: false,
  },
  {
    id: "vercel",
    app: "Vercel",
    name: "Vercel",
    version: "v0.3.6",
    description: "Tools that enable LLMs to manage deployments, domains, and project settings.",
    category: "Developer",
    authType: "OAuth",
    toolCount: 25,
    tools: ["Vercel.ListDeployments", "Vercel.CreateDeployment", "Vercel.GetProject"],
    connected: false,
  },
  {
    id: "zendesk",
    app: "Zendesk",
    name: "Zendesk",
    version: "v0.6.0",
    description: "Tools that enable LLMs to create tickets, search help center, and update requests.",
    category: "Communication",
    authType: "OAuth",
    toolCount: 34,
    tools: ["Zendesk.CreateTicket", "Zendesk.SearchTickets", "Zendesk.AddComment"],
    connected: false,
  },
  {
    id: "computer-use",
    app: "Arcade",
    name: "Computer",
    version: "v0.1.0",
    description: "Tools that enable LLMs to run browser and desktop automation for computer-use agents.",
    category: "Productivity",
    authType: "Secrets",
    toolCount: 6,
    tools: ["Computer.Click", "Computer.Type", "Computer.Screenshot", "Computer.Navigate"],
    connected: false,
    tags: ["computer"],
  },
];

export const CATALOG_SIDEBAR_GROUPS: Array<{
  label?: string;
  items: Array<{ id: CatalogFilter; label: string }>;
}> = [
  {
    items: [
      { id: "all", label: "All" },
      { id: "connected", label: "Connected" },
    ],
  },
  {
    label: "Categories",
    items: [
      { id: "productivity", label: "Productivity" },
      { id: "developer", label: "Developer" },
      { id: "communication", label: "Communication" },
      { id: "data", label: "Data" },
      { id: "research", label: "Research" },
    ],
  },
  {
    label: "Apps",
    items: [
      { id: "slack-teams", label: "Slack & Teams" },
      { id: "arcade", label: "Arcade" },
    ],
  },
  {
    label: "Workspace",
    items: [{ id: "computer", label: "Computer" }],
  },
];

const CATEGORY_FILTERS: Record<
  "productivity" | "developer" | "communication" | "data" | "research",
  CatalogCategory
> = {
  productivity: "Productivity",
  developer: "Developer",
  communication: "Communication",
  data: "Data",
  research: "Research",
};

const TAG_FILTERS = new Set<CatalogFilter>(["slack-teams", "arcade", "computer"]);

export function filterCatalogIntegrations(
  integrations: CatalogIntegration[],
  filter: CatalogFilter,
  query: string,
): CatalogIntegration[] {
  const normalizedQuery = query.trim().toLowerCase();

  return integrations.filter((item) => {
    let matchesFilter = true;

    if (filter === "connected") {
      matchesFilter = item.connected;
    } else if (filter in CATEGORY_FILTERS) {
      matchesFilter =
        item.category === CATEGORY_FILTERS[filter as keyof typeof CATEGORY_FILTERS];
    } else if (TAG_FILTERS.has(filter)) {
      matchesFilter = item.tags?.includes(filter as "slack-teams" | "arcade" | "computer") ?? false;
    }

    if (!matchesFilter) return false;
    if (!normalizedQuery) return true;

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.app.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.version.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function sortCatalogIntegrations(integrations: CatalogIntegration[]) {
  return [...integrations].sort((a, b) => a.name.localeCompare(b.name));
}
