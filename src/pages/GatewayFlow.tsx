import { useMemo, useState } from "react";
import { Copy } from "@phosphor-icons/react";
import { FlowStepNav } from "../components/flows/FlowStepNav";
import { FlowShell } from "../components/flows/FlowShell";
import { GatewayTracePanel } from "../components/flows/LiveTracePanel";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { useApp } from "../context/AppContext";
import { GATEWAY_CONFIG } from "../data/mockProject";
import { StatusBadge } from "../components/primitives/StatusBadge";

const STEPS = [
  { id: "goal", label: "Pick goal" },
  { id: "tools", label: "Select tools" },
  { id: "config", label: "Gateway config" },
  { id: "apps", label: "Connect apps" },
  { id: "client", label: "Choose client" },
  { id: "copy", label: "Copy config" },
  { id: "test", label: "Test" },
  { id: "logs", label: "Logs" },
];

const GOALS = [
  { id: "triage", title: "Triage inbound issues", tools: "GitHub · Linear · Slack" },
  { id: "inbox", title: "Stay on top of inbox", tools: "Gmail · Slack" },
  { id: "day", title: "Plan my day", tools: "Calendar · Gmail · Drive" },
  { id: "custom", title: "Custom toolset", tools: "Choose manually" },
];

const TOOLS = [
  { action: "GitHub.SearchIssues", app: "GitHub", auth: true },
  { action: "Linear.CreateIssue", app: "Linear", auth: true },
  { action: "Slack.SendMessage", app: "Slack", auth: true },
];

const CLIENTS = ["Cursor", "Claude Desktop", "Claude Code", "Windsurf", "VS Code", "Other MCP client"];

export function GatewayFlow() {
  const { setScreen, finishFlow } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("triage");
  const [client, setClient] = useState("Cursor");
  const [humanConfirm, setHumanConfirm] = useState(true);
  const goBack = () => setScreen("get-started");

  const complete = step >= 7;
  const traceSteps = complete
    ? [
        { label: "Client connected", done: true, icon: "check" as const },
        { label: "Tool list requested", done: true, icon: "check" as const },
        { label: "GitHub.SearchIssues called", done: true, icon: "bolt" as const },
        { label: "Audit log saved", done: true, icon: "shield" as const },
      ]
    : undefined;

  const panels = useMemo(
    () => [
      <div key="goal" className="step-panel">
        <h3>Pick a workflow goal</h3>
        <div className="goal-grid">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`goal-card ${goal === g.id ? "selected" : ""}`}
              onClick={() => setGoal(g.id)}
            >
              <strong>{g.title}</strong>
              <span>{g.tools}</span>
            </button>
          ))}
        </div>
        <FlowStepNav step={0} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="tools" className="step-panel">
        <h3>Select tools</h3>
        <div className="tool-select-list">
          {TOOLS.map((t) => (
            <label key={t.action} className="tool-select-row">
              <input type="checkbox" defaultChecked />
              <span className="mono">{t.action}</span>
              <span className="chip chip-with-logo">
                <BrandLogo name={t.app} size={12} />
                {t.app}
              </span>
              {t.auth && <span className="chip chip-amber">Auth needed</span>}
            </label>
          ))}
        </div>
        <FlowStepNav step={1} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="config" className="step-panel">
        <h3>Gateway config</h3>
        <label className="field-label">Gateway name</label>
        <input className="field-input" defaultValue="Engineering triage" />
        <label className="field-label">Environment</label>
        <input className="field-input" defaultValue="Sandbox" />
        <label className="field-label">Access</label>
        <input className="field-input" defaultValue="Project members only" />
        <label className="toggle-row">
          <input type="checkbox" checked={humanConfirm} onChange={(e) => setHumanConfirm(e.target.checked)} />
          Human confirmation for message sending
        </label>
        <FlowStepNav step={2} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="apps" className="step-panel">
        <h3>Connect required apps</h3>
        {["GitHub", "Linear", "Slack"].map((app, i) => (
          <div key={app} className="app-connect-row">
            <span className="app-connect-label">
              <BrandLogo name={app} size={16} />
              {app}
            </span>
            {i === 0 ? (
              <StatusBadge status="healthy" small />
            ) : (
              <button type="button" className="btn btn-secondary btn-sm">
                Connect
              </button>
            )}
          </div>
        ))}
        <FlowStepNav step={3} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="client" className="step-panel">
        <h3>Choose AI client</h3>
        <div className="option-grid">
          {CLIENTS.map((c) => (
            <button
              key={c}
              type="button"
              className={`option-card ${client === c ? "selected" : ""}`}
              onClick={() => setClient(c)}
            >
              <span className="option-card-label">
                <BrandLogo name={c} size={14} />
                {c}
              </span>
            </button>
          ))}
        </div>
        <FlowStepNav step={4} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="copy" className="step-panel">
        <h3>Copy config</h3>
        <p>Add this to your {client} MCP settings.</p>
        <div className="code-block code-block-tall">
          <pre className="mono">{GATEWAY_CONFIG}</pre>
          <button type="button" aria-label="Copy">
            <Copy size={16} />
          </button>
        </div>
        <FlowStepNav step={5} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="test" className="step-panel">
        <h3>Test from {client}</h3>
        <p>Send one test call from your client to verify the gateway.</p>
        <FlowStepNav
          step={6}
          setStep={setStep}
          max={STEPS.length - 1}
          nextLabel="Simulate test call"
          onNext={() => setStep(7)}
        />
      </div>,
      <div key="logs" className="step-panel step-success">
        <h3>Gateway is live</h3>
        <p>Connected to {client}. First tool calls logged. Support Triage now appears on Project Home.</p>
        <FlowStepNav step={7} setStep={setStep} max={STEPS.length - 1} hideNext />
      </div>,
    ],
    [goal, client, humanConfirm],
  );

  return (
    <FlowShell
      title="Connect an AI client"
      subtitle="Create a gateway, copy client config, and log your first tool call."
      steps={STEPS}
      currentStep={step}
      panels={panels}
      onBack={goBack}
      headerTitle="MCP Gateway"
      onFinish={finishFlow}
      showFinish={complete}
      finishLabel="View on Project Home"
      tracePanel={
        <GatewayTracePanel
          gatewayStatus={step >= 2 ? "Created" : "Draft"}
          clientStatus={step >= 6 ? "Connected" : "Waiting"}
          toolCallsStatus={complete ? "2 logged" : "Waiting"}
          steps={traceSteps}
        />
      }
    />
  );
}
