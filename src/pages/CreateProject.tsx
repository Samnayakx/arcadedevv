import { GithubLogo, Globe } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { OnboardingShell } from "../components/chrome/OnboardingShell";
import {
  SetupCheckboxRow,
  SetupFormPanel,
  SetupFormRow,
  SetupSelect,
} from "../components/onboarding/SetupFormPanel";
import { useApp } from "../context/AppContext";

const REGIONS = [
  { value: "us-east", label: "Americas — US East" },
  { value: "eu-west", label: "Europe — EU West" },
  { value: "ap-south", label: "Asia-Pacific — Mumbai" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateProject() {
  const { setScreen, organizationName, setProjectName } = useApp();
  const defaultProjectName = useMemo(
    () => `${organizationName.replace(/'s Org$/, "")}'s Project`,
    [organizationName],
  );

  const [projectName, setProjectNameLocal] = useState(defaultProjectName);
  const [region, setRegion] = useState("ap-south");
  const [environment, setEnvironment] = useState("sandbox");
  const [enableGateway, setEnableGateway] = useState(true);
  const [exposeTools, setExposeTools] = useState(true);
  const [requirePolicyReview, setRequirePolicyReview] = useState(false);

  const handleSubmit = () => {
    setProjectName(projectName.trim() || defaultProjectName);
    setScreen("get-started");
  };

  return (
    <OnboardingShell
      headerTrail={`${organizationName} / New project`}
      orgBadge="FREE"
    >
      <SetupFormPanel
        title="Create a new project"
        description="Your project includes a dedicated tool gateway, execution logs, and an API for agent workflows. Resources are isolated from other projects in your organization."
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={() => setScreen("create-organization")}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-md" onClick={handleSubmit}>
              Create project
            </button>
          </>
        }
      >
        <SetupFormRow label="Organization">
          <select className="setup-input setup-select" value={organizationName} disabled>
            <option value={organizationName}>{organizationName}</option>
          </select>
          <span className="setup-badge setup-badge-inline">FREE</span>
        </SetupFormRow>

        <SetupFormRow
          label="GitHub"
          hint="Connect a repository to sync tool definitions and deploy agent flows from code."
        >
          <div className="setup-github-block">
            <button type="button" className="btn btn-secondary btn-md setup-github-btn">
              <GithubLogo size={16} weight="fill" />
              Connect GitHub
            </button>
            <p>
              Optional. Link GitHub for agent-first workflows and versioned tool configs.{" "}
              <button type="button" className="setup-inline-link">
                Learn more
              </button>
            </p>
          </div>
        </SetupFormRow>

        <SetupFormRow label="Project name">
          <input
            className="setup-input"
            value={projectName}
            onChange={(event) => setProjectNameLocal(event.target.value)}
            placeholder="my-agent-project"
          />
          <p className="setup-field-meta">Project ID: {slugify(projectName) || "my-agent-project"}</p>
        </SetupFormRow>

        <SetupFormRow
          label="Environment"
          hint="Sandbox is recommended while building. Production enforces stricter policies."
        >
          <SetupSelect
            value={environment}
            onChange={setEnvironment}
            options={[
              { value: "sandbox", label: "Sandbox" },
              { value: "production", label: "Production" },
            ]}
          />
        </SetupFormRow>

        <SetupFormRow
          label="Region"
          hint="Select the region closest to your users and agent workloads for lower latency."
        >
          <div className="setup-select-wrap setup-select-region">
            <Globe size={16} className="setup-select-icon" />
            <select
              className="setup-input setup-select"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {REGIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </SetupFormRow>

        <div className="setup-form-section">
          <h2>Security options</h2>
          <div className="setup-checkbox-list">
            <SetupCheckboxRow
              checked={enableGateway}
              onChange={setEnableGateway}
              title="Enable Tool Gateway API"
              description="Autogenerates a REST and MCP gateway for this project so agents can call tools securely."
            />
            <SetupCheckboxRow
              checked={exposeTools}
              onChange={setExposeTools}
              title="Automatically expose new tools"
              description="New tools are available to enabled flows by default. Disable to require manual approval per tool."
            />
            <SetupCheckboxRow
              checked={requirePolicyReview}
              onChange={setRequirePolicyReview}
              title="Require policy review on write tools"
              description="Write and delete actions stay blocked until a policy explicitly allows them."
            />
          </div>
        </div>

        <button type="button" className="setup-advanced-link">
          Advanced configuration →
        </button>
      </SetupFormPanel>
    </OnboardingShell>
  );
}
