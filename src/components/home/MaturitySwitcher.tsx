import { useApp } from "../../context/AppContext";
import type { ProjectMaturity } from "../../types";

export const MATURITY_STAGES: {
  id: ProjectMaturity;
  label: string;
  hint: string;
}[] = [
  {
    id: "empty",
    label: "Empty",
    hint: "New project — no agent flows yet",
  },
  {
    id: "flow_no_auth",
    label: "Needs auth",
    hint: "Flow created — waiting on tool authorization",
  },
  {
    id: "first_run",
    label: "First run",
    hint: "First sandbox trace succeeded — ready to deploy",
  },
  {
    id: "active",
    label: "Active",
    hint: "Live operations with runs, logs, and governance",
  },
];

export function maturityStageHint(maturity: ProjectMaturity) {
  return MATURITY_STAGES.find((stage) => stage.id === maturity)?.hint ?? "";
}

export function MaturitySwitcher() {
  const { maturity, setMaturity } = useApp();
  const current = MATURITY_STAGES.find((stage) => stage.id === maturity);

  return (
    <div className="maturity-switcher">
      <span className="field-label">Demo state</span>
      <select
        className="maturity-switcher-select"
        value={maturity}
        onChange={(event) => setMaturity(event.target.value as ProjectMaturity)}
        aria-describedby="maturity-switcher-hint"
      >
        {MATURITY_STAGES.map((stage) => (
          <option key={stage.id} value={stage.id}>
            {stage.label}
          </option>
        ))}
      </select>
      {current && (
        <p id="maturity-switcher-hint" className="maturity-switcher-hint">
          {current.hint}
        </p>
      )}
    </div>
  );
}
