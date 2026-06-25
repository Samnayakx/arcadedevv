export interface CatalogTool {
  id: string;
  name: string;
  description: string;
  paramCount: number;
  requirement: string;
}

const AIRTABLE_TOOL_PRESETS: Array<Pick<CatalogTool, "name" | "description" | "paramCount">> = [
  {
    name: "AddBaseCollaborator",
    description: "Add a collaborator to an Airtable base with specified permissions.",
    paramCount: 3,
  },
  {
    name: "AirtableGetRecord",
    description: "Retrieve a single record from an Airtable table.",
    paramCount: 3,
  },
  {
    name: "BulkUpdateAirtable",
    description: "Update multiple records in an Airtable table in a single request.",
    paramCount: 4,
  },
  {
    name: "CreateAirtableRecord",
    description: "Create a new record in the specified Airtable table.",
    paramCount: 4,
  },
  {
    name: "DeleteAirtableRecord",
    description: "Delete a record from an Airtable table by record ID.",
    paramCount: 3,
  },
  {
    name: "GetAirtableBaseSchema",
    description: "Retrieve the schema for an Airtable base including tables and fields.",
    paramCount: 2,
  },
  {
    name: "ListAirtableBases",
    description: "List all Airtable bases accessible to the authenticated user.",
    paramCount: 2,
  },
  {
    name: "ListAirtableRecords",
    description: "List records from an Airtable table with optional filtering.",
    paramCount: 5,
  },
  {
    name: "SearchAirtableRecords",
    description: "Search records in an Airtable table using a formula or filter.",
    paramCount: 4,
  },
  {
    name: "UpdateAirtableRecord",
    description: "Update fields on an existing Airtable record.",
    paramCount: 4,
  },
];

const GENERIC_ACTIONS = [
  "List",
  "Get",
  "Create",
  "Update",
  "Delete",
  "Search",
  "BulkUpdate",
  "Sync",
  "Validate",
  "Export",
];

function defaultDescription(toolName: string, integrationName: string) {
  const action = toolName.includes(".") ? toolName.split(".").pop()! : toolName;
  return `Execute ${action} through the ${integrationName} integration.`;
}

function buildGeneratedTools(
  integrationId: string,
  integrationName: string,
  toolCount: number,
  requirement: string,
  presets: Array<Pick<CatalogTool, "name" | "description" | "paramCount">> = [],
): CatalogTool[] {
  const tools: CatalogTool[] = presets.map((preset, index) => ({
    id: `${integrationId}-tool-${index}`,
    ...preset,
    requirement,
  }));

  let index = tools.length;
  while (tools.length < toolCount) {
    const action = GENERIC_ACTIONS[index % GENERIC_ACTIONS.length];
    const suffix = index >= GENERIC_ACTIONS.length ? String(Math.floor(index / GENERIC_ACTIONS.length) + 1) : "";
    const name = `${action}${integrationName.replace(/\s+/g, "")}${suffix}`;
    tools.push({
      id: `${integrationId}-tool-${index}`,
      name,
      description: defaultDescription(name, integrationName),
      paramCount: 2 + (index % 4),
      requirement,
    });
    index += 1;
  }

  return tools;
}

export function getCatalogTools(
  integrationId: string,
  integrationName: string,
  toolCount: number,
  fallbackNames: string[] = [],
): CatalogTool[] {
  const requirement = `arcade-${integrationId}`;

  if (integrationId === "airtable") {
    return buildGeneratedTools(integrationId, integrationName, toolCount, requirement, AIRTABLE_TOOL_PRESETS);
  }

  if (fallbackNames.length > 0 && toolCount <= fallbackNames.length) {
    return fallbackNames.map((fullName, index) => {
      const name = fullName.includes(".") ? fullName.split(".").pop()! : fullName;
      return {
        id: `${integrationId}-tool-${index}`,
        name,
        description: defaultDescription(fullName, integrationName),
        paramCount: 2 + (index % 4),
        requirement,
      };
    });
  }

  return buildGeneratedTools(integrationId, integrationName, toolCount, requirement);
}
