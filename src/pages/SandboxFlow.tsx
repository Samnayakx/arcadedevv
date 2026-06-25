import { useMemo, useState } from "react";
import { FlowStepNav } from "../components/flows/FlowStepNav";
import { FlowShell } from "../components/flows/FlowShell";
import { LiveTracePanel } from "../components/flows/LiveTracePanel";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { useApp } from "../context/AppContext";

const STEPS = [
  { id: "action", label: "Choose action" },
  { id: "auth", label: "Authorize" },
  { id: "review", label: "Review" },
  { id: "run", label: "Run" },
  { id: "trace", label: "Trace" },
  { id: "next", label: "Next path" },
];

const STARTERS = [
  { action: "Create GitHub issue", tool: "GitHub.CreateIssue", app: "GitHub", risk: "Medium" },
  { action: "Send Slack message", tool: "Slack.SendMessage", app: "Slack", risk: "Medium" },
  { action: "Search Gmail", tool: "Gmail.Search", app: "Gmail", risk: "Low" },
  { action: "Create Linear task", tool: "Linear.CreateIssue", app: "Linear", risk: "Low" },
];

export function SandboxFlow() {
  const { setScreen, finishFlow } = useApp();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(STARTERS[0]);
  const goBack = () => setScreen("get-started");

  const traceSteps =
    step >= 4
      ? [
          { label: "Sandbox user verified", done: true, icon: "user" as const },
          { label: "GitHub OAuth scopes approved", done: true, icon: "key" as const },
          { label: "GitHub.CreateIssue executed", done: true, icon: "bolt" as const },
          { label: "Issue #sandbox-1042 created", done: true, icon: "check" as const },
          { label: "Audit log saved · arc_tr_sbx_01", done: true, icon: "shield" as const },
        ]
      : step >= 3
        ? [
            { label: "Sandbox user verified", done: true, icon: "user" as const },
            { label: "Scopes approved", done: true, icon: "key" as const },
            { label: "Running GitHub.CreateIssue...", done: false, icon: "bolt" as const },
          ]
        : undefined;

  const panels = useMemo(
    () => [
      <div key="action" className="step-panel">
        <h3>Choose a starter action</h3>
        <div className="starter-grid">
          {STARTERS.map((s) => (
            <button
              key={s.tool}
              type="button"
              className={`starter-card ${selected.tool === s.tool ? "selected" : ""}`}
              onClick={() => setSelected(s)}
            >
              <strong>{s.action}</strong>
              <span className="mono">{s.tool}</span>
              <div className="starter-meta">
                <span className="chip chip-with-logo">
                  <BrandLogo name={s.app} size={12} />
                  {s.app}
                </span>
                <span className="chip">Risk: {s.risk}</span>
                <span className="chip chip-green">Sandbox</span>
              </div>
            </button>
          ))}
        </div>
        <FlowStepNav step={0} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="auth" className="step-panel">
        <h3>Authorize {selected.app}</h3>
        <p>Connect once. Only required scopes. Token stored securely in Arcade.</p>
        <ul className="scope-list mono">
          <li>repo:read</li>
          <li>issues:write</li>
        </ul>
        <FlowStepNav
          step={1}
          setStep={setStep}
          max={STEPS.length - 1}
          nextLabel="Connect"
          onNext={() => setStep(2)}
        />
      </div>,
      <div key="review" className="step-panel">
        <h3>Review tool call</h3>
        <div className="review-block">
          <div>
            <span>Tool</span>
            <span className="mono">{selected.tool}</span>
          </div>
          <div>
            <span>On behalf of</span>
            <span>Sandbox user (you)</span>
          </div>
          <div>
            <span>Input</span>
            <span className="mono">{`{ title: "Sandbox test issue" }`}</span>
          </div>
        </div>
        <FlowStepNav step={2} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="run" className="step-panel">
        <h3>Run sandbox test</h3>
        <p>Execute the sandbox call and inspect the trace.</p>
        <FlowStepNav
          step={3}
          setStep={setStep}
          max={STEPS.length - 1}
          nextLabel="Run sandbox test"
          onNext={() => setStep(4)}
        />
      </div>,
      <div key="trace" className="step-panel step-success">
        <h3>Trace logged</h3>
        <p>
          Sandbox issue created. Trace ID: <span className="mono">arc_tr_sbx_01</span>
        </p>
        <FlowStepNav step={4} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="next" className="step-panel">
        <h3>What&apos;s next?</h3>
        <div className="next-path-grid">
          <button type="button" className="next-path-card" onClick={() => setScreen("build")}>
            Build into your agent
          </button>
          <button type="button" className="next-path-card" onClick={() => setScreen("gateway")}>
            Use in Cursor or Claude
          </button>
          <button type="button" className="next-path-card" onClick={finishFlow}>
            View full trace on Project Home
          </button>
        </div>
        <FlowStepNav step={5} setStep={setStep} max={STEPS.length - 1} hideNext />
      </div>,
    ],
    [selected, setScreen, finishFlow],
  );

  return (
    <FlowShell
      title="Try a tool call"
      subtitle="Authorize once, run a sandbox action, and inspect the trace."
      steps={STEPS}
      currentStep={step}
      panels={panels}
      onBack={goBack}
      headerTitle="Sandbox Test"
      onFinish={finishFlow}
      showFinish={step === 5}
      tracePanel={
        <LiveTracePanel
          status={step >= 4 ? "complete" : step >= 3 ? "active" : "waiting"}
          steps={traceSteps}
          waitingMessage="Trace will appear when you run the sandbox test."
        />
      }
    />
  );
}
