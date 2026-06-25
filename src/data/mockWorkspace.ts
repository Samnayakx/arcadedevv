export interface WorkspaceOrg {
  id: string;
  name: string;
}

export interface WorkspaceProject {
  id: string;
  name: string;
  orgId: string;
}

export const WORKSPACE_ORGS: WorkspaceOrg[] = [
  { id: "org-sambit", name: "sambit's org" },
  { id: "org-arcade", name: "Arcade Labs" },
  { id: "org-demo", name: "Demo workspace" },
];

export const WORKSPACE_PROJECTS: WorkspaceProject[] = [
  { id: "proj-default", name: "Default project", orgId: "org-sambit" },
  { id: "proj-sandbox", name: "Sandbox", orgId: "org-sambit" },
  { id: "proj-prod", name: "Production", orgId: "org-arcade" },
  { id: "proj-staging", name: "Staging", orgId: "org-arcade" },
  { id: "proj-demo", name: "Demo project", orgId: "org-demo" },
];
