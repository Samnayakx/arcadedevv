const LOGO_DEV_TOKEN = "pk_Jy8f0DYRTReqn_I-V-PWpQ";

const APP_DOMAINS: Record<string, string> = {
  github: "github.com",
  slack: "slack.com",
  stripe: "stripe.com",
  gmail: "gmail.com",
  google: "google.com",
  linear: "linear.app",
  zendesk: "zendesk.com",
  salesforce: "salesforce.com",
  hubspot: "hubspot.com",
  airtable: "airtable.com",
  cursor: "cursor.com",
  claude: "anthropic.com",
  windsurf: "codeium.com",
  "vs code": "visualstudio.com",
  vercel: "vercel.com",
  "vercel ai sdk": "vercel.com",
  cloudflare: "cloudflare.com",
  langchain: "langchain.com",
  mastra: "mastra.ai",
  openai: "openai.com",
  "openai agents sdk": "openai.com",
  calendar: "google.com",
  linkedin: "linkedin.com",
  drive: "google.com",
  arcade: "arcade.dev",
  microsoft: "microsoft.com",
  excel: "microsoft.com",
  outlook: "microsoft.com",
  powerpoint: "microsoft.com",
  sharepoint: "microsoft.com",
  teams: "microsoft.com",
  word: "microsoft.com",
  notion: "notion.so",
  jira: "atlassian.com",
  asana: "asana.com",
  apollo: "apollo.io",
  datadog: "datadoghq.com",
  dropbox: "dropbox.com",
  figma: "figma.com",
  intercom: "intercom.com",
  mongodb: "mongodb.com",
  snowflake: "snowflake.com",
  twilio: "twilio.com",
};

export function getBrandDomain(name: string): string | null {
  const key = name.trim().toLowerCase();
  return APP_DOMAINS[key] ?? null;
}

export function getBrandLogoUrl(name: string, size = 20): string | null {
  const domain = getBrandDomain(name);
  if (!domain) return null;

  const params = new URLSearchParams({
    token: LOGO_DEV_TOKEN,
    format: "png",
    theme: "dark",
    size: String(Math.min(800, Math.max(16, size * 2))),
    retina: "true",
  });

  return `https://img.logo.dev/${domain}?${params.toString()}`;
}

export function hasBrandLogo(name: string): boolean {
  return getBrandDomain(name) !== null;
}
