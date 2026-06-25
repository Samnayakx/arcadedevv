import { Check, Circle, Key, RocketLaunch, Wrench } from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";
import type { ProjectMaturity, Run } from "../../types";
import { AppLogoList } from "../primitives/AppChip";
import { StatusBadge } from "../primitives/StatusBadge";

const SETUP_STEPS = [
  { id: "tools", label: "Pick tools", icon: Wrench },
  { id: "auth", label: "Connect auth", icon: Key },
  { id: "run", label: "Test action", icon: Check },
] as const;

const GO_LIVE_STEP = { id: "deploy", label: "Deploy", icon: RocketLaunch } as const;

function stepState(maturity: ProjectMaturity, stepId: (typeof SETUP_STEPS)[number]["id"]) {
  if (maturity === "flow_no_auth") {
    if (stepId === "tools") return "done";
    if (stepId === "auth") return "current";
    return "pending";
  }
  if (maturity === "first_run") {
    return "done";
  }
  return "pending";
}

export function ControlCenterEmptyHero() {
  const { setScreen } = useApp();

  return (
    <section className="control-center-empty-hero">
      <div className="control-center-empty-copy">
        <h2>Create your first agent flow</h2>
        <p>
          Your project is ready. Connect a tool and run your first agent action.
        </p>
      </div>

      <ol className="control-center-empty-steps">
        {SETUP_STEPS.map((step, index) => (
          <li key={step.id}>
            <span className="control-center-empty-step-num">{index + 1}</span>
            <step.icon size={18} weight="regular" />
            <span>{step.label}</span>
          </li>
        ))}
      </ol>

      <div className="control-center-empty-actions">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => setScreen("get-started")}>
          New Agent
        </button>
        <button type="button" className="btn btn-secondary btn-md" onClick={() => setScreen("get-started")}>
          Browse tools
        </button>
      </div>
    </section>
  );
}

export function SetupProgressChecklist({ maturity }: { maturity: ProjectMaturity }) {
  return (
    <div className="setup-progress-checklist dashboard-card">
      <div className="dashboard-card-head">
        <h3>Setup progress</h3>
        <span className="dashboard-card-meta">Finish these steps to run your first action</span>
      </div>
      <ul className="setup-progress-list">
        {SETUP_STEPS.map((step) => {
          const state = stepState(maturity, step.id);
          return (
            <li key={step.id} className={`setup-progress-item setup-progress-${state}`}>
              <span className="setup-progress-icon">
                {state === "done" ? (
                  <Check size={14} weight="bold" />
                ) : (
                  <Circle size={14} />
                )}
              </span>
              <span>{step.label}</span>
              {state === "current" && <span className="setup-progress-badge">In progress</span>}
              {state === "done" && <span className="setup-progress-badge">Done</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function FirstRunMilestone() {
  const allSteps = [...SETUP_STEPS, GO_LIVE_STEP];

  return (
    <div className="first-run-milestone dashboard-card">
      <div className="dashboard-card-head">
        <h3>Setup progress</h3>
        <span className="dashboard-card-meta">3 of 4 · Deploy to go live</span>
      </div>

      <ol className="first-run-stepper" aria-label="Setup progress">
        {allSteps.map((step, index) => {
          const isDone = step.id !== "deploy";
          const isCurrent = step.id === "deploy";
          const isLast = index === allSteps.length - 1;

          return (
            <li
              key={step.id}
              className={`first-run-step ${isDone ? "first-run-step-done" : ""} ${isCurrent ? "first-run-step-current" : ""}`}
            >
              <div className="first-run-step-track">
                <span className="first-run-step-marker">
                  {isDone ? <Check size={12} weight="bold" /> : null}
                </span>
                {!isLast && <span className="first-run-step-line" aria-hidden="true" />}
              </div>
              <span className="first-run-step-label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function FirstRunResultCard({
  run,
  onOpenRun,
}: {
  run: Run;
  onOpenRun: (runId: string) => void;
}) {
  return (
    <div className="first-run-result dashboard-card">
      <div className="dashboard-card-head">
        <h3>Your first trace</h3>
        <StatusBadge status={run.status} small />
      </div>
      <div className="first-run-result-body">
        <p className="first-run-result-title">{run.name}</p>
        <dl className="first-run-result-meta">
          <div>
            <dt>Agent</dt>
            <dd>{run.flowName}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{run.duration}</dd>
          </div>
          <div>
            <dt>Triggered by</dt>
            <dd>{run.triggeredBy}</dd>
          </div>
          <div>
            <dt>Tools used</dt>
            <dd><AppLogoList apps={run.toolsCalled} /></dd>
          </div>
        </dl>
        <button type="button" className="btn btn-secondary btn-sm first-run-result-trace" onClick={() => onOpenRun(run.id)}>
          View full trace
        </button>
      </div>
    </div>
  );
}
