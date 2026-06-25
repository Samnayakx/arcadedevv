import { useState } from "react";
import { OnboardingShell } from "../components/chrome/OnboardingShell";
import {
  SetupFormPanel,
  SetupFormRow,
  SetupSelect,
} from "../components/onboarding/SetupFormPanel";
import { useApp } from "../context/AppContext";

const ORG_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "team", label: "Team" },
];

const PLANS = [
  { value: "free", label: "Free — $0/month", badge: "FREE" },
  { value: "pro", label: "Pro — $49/month" },
];

export function CreateOrganization() {
  const { setScreen, setOrganizationName } = useApp();
  const [name, setName] = useState("Sambit Nayak's Org");
  const [orgType, setOrgType] = useState("personal");
  const [plan, setPlan] = useState("free");

  const handleSubmit = () => {
    setOrganizationName(name.trim() || "Sambit Nayak's Org");
    setScreen("create-project");
  };

  return (
    <OnboardingShell headerTrail="New organization">
      <SetupFormPanel
        title="Create a new organization"
        description="Organizations group projects, team members, and billing. You can invite collaborators and manage API access from one place."
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={() => setScreen("active")}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-primary btn-md" onClick={handleSubmit}>
              Create organization
            </button>
          </>
        }
      >
        <SetupFormRow
          label="Name"
          hint="What's the name of your company or team? You can change this later."
        >
          <input
            className="setup-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Acme Inc."
          />
        </SetupFormRow>

        <SetupFormRow label="Type" hint="What best describes your organization?">
          <SetupSelect value={orgType} onChange={setOrgType} options={ORG_TYPES} />
        </SetupFormRow>

        <SetupFormRow
          label="Plan"
          hint={
            <>
              Which plan fits your organization&apos;s needs best?{" "}
              <button type="button" className="setup-inline-link">
                Learn more
              </button>
            </>
          }
        >
          <SetupSelect value={plan} onChange={setPlan} options={PLANS} />
        </SetupFormRow>
      </SetupFormPanel>
    </OnboardingShell>
  );
}
