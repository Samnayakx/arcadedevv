import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, ArrowSquareOut } from "@phosphor-icons/react";
import { FlowStepNav } from "../components/flows/FlowStepNav";
import { FlowShell } from "../components/flows/FlowShell";
import { LiveTracePanel } from "../components/flows/LiveTracePanel";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { useApp } from "../context/AppContext";
import { API_KEY_PLACEHOLDER, SDK_INSTALL } from "../data/mockProject";
import { StatusBadge } from "../components/primitives/StatusBadge";
import type { SetupState, SetupStepKey } from "../types";

const RUN_CODE = `import { Arcade } from "@arcadeai/arcade";

const client = new Arcade({ apiKey: process.env.ARCADE_API_KEY });

const result = await client.tools.execute({
  tool: "GitHub.CreateIssue",
  userId: "user_alex",
  input: { title: "CSV export bug", body: "..." },
});`;

function initialStep(s: SetupState): number {
  if (s.first_run_received || s.trace_created) return 7;
  if (s.code_copied || s.auth_completed) return 6;
  if (s.tool_action_selected) return 5;
  if (s.api_key_copied) return 4;
  if (s.sdk_copied) return 3;
  if (s.framework_selected) return 2;
  return 0;
}

const STEPS = [
  { id: "framework", label: "Framework" },
  { id: "env", label: "Environment" },
  { id: "install", label: "Install SDK" },
  { id: "apikey", label: "API key" },
  { id: "action", label: "First action" },
  { id: "permissions", label: "Permissions" },
  { id: "run", label: "Run locally" },
  { id: "trace", label: "Trace" },
];

const FRAMEWORKS = ["LangChain", "Mastra", "Vercel AI SDK", "OpenAI Agents SDK"];

const TOOL_ACTIONS = [
  {
    action: "GitHub.CreateIssue",
    app: "GitHub",
    oauth: true,
    risk: "Medium",
    sandbox: true,
  },
  {
    action: "Slack.SendMessage",
    app: "Slack",
    oauth: true,
    risk: "Medium",
    sandbox: true,
  },
];

export function BuildAgentFlow() {
  const {
    setScreen,
    finishFlow,
    playgroundPrompt,
    setPlaygroundPrompt,
    setupState,
    markSetupStep,
  } = useApp();
  const [step, setStep] = useState(() => initialStep(setupState));
  const [framework, setFramework] = useState("LangChain");
  const [pm, setPm] = useState("npm");
  const [copied, setCopied] = useState<SetupStepKey | null>(null);

  const goBack = () => {
    setPlaygroundPrompt(null);
    setScreen("get-started");
  };

  const handleCopy = useCallback(
    async (text: string, key: SetupStepKey) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard may be unavailable (insecure context) — still track intent.
      }
      markSetupStep(key);
      setCopied(key);
    },
    [markSetupStep],
  );

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (step >= 7) markSetupStep("trace_created");
  }, [step, markSetupStep]);

  const traceSteps =
    step >= 7
      ? [
          { label: "Agent requested tool call", done: true, icon: "user" as const },
          { label: "User auth checked", done: true, icon: "key" as const },
          { label: "Scopes approved: issues:write", done: true, icon: "key" as const },
          { label: "GitHub.CreateIssue executed", done: true, icon: "bolt" as const },
          { label: "Result returned to agent", done: true, icon: "check" as const },
          { label: "Audit log saved", done: true, icon: "shield" as const },
        ]
      : undefined;

  const panels = useMemo(
    () => [
      <div key="framework" className="step-panel">
        <h3>Choose framework</h3>
        {playgroundPrompt && (
          <div className="playground-prefill-banner">
            <strong>From Playground:</strong> {playgroundPrompt}
          </div>
        )}
        <p>Select how your agent will call Arcade tools.</p>
        <div className="option-grid">
          {FRAMEWORKS.map((f) => (
            <button
              key={f}
              type="button"
              className={`option-card ${framework === f ? "selected" : ""}`}
              onClick={() => {
                setFramework(f);
                markSetupStep("framework_selected");
              }}
            >
              <span className="option-card-label">
                <BrandLogo name={f} size={14} />
                {f}
              </span>
            </button>
          ))}
        </div>
        <a href="https://docs.arcade.dev" className="advanced-link" target="_blank" rel="noreferrer">
          Advanced: build a custom MCP server <ArrowSquareOut size={14} />
        </a>
        <FlowStepNav
          step={0}
          setStep={setStep}
          max={STEPS.length - 1}
          onNext={() => {
            markSetupStep("framework_selected");
            setStep(1);
          }}
        />
      </div>,
      <div key="env" className="step-panel">
        <h3>Environment</h3>
        <label className="field-label">Language</label>
        <div className="pill-row">
          {["TypeScript", "Python"].map((l) => (
            <button key={l} type="button" className="pill selected">
              {l}
            </button>
          ))}
        </div>
        <label className="field-label">Environment</label>
        <div className="pill-row">
          {["Local", "Server", "Vercel", "Cloudflare"].map((e) => (
            <button key={e} type="button" className={`pill ${e === "Local" ? "selected" : ""}`}>
              <span className="chip-with-logo">
                {(e === "Vercel" || e === "Cloudflare") && <BrandLogo name={e} size={12} />}
                {e}
              </span>
            </button>
          ))}
        </div>
        <FlowStepNav step={1} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="install" className="step-panel">
        <h3>Install Arcade SDK</h3>
        <div className="pm-tabs">
          {(["npm", "pnpm", "yarn", "bun"] as const).map((p) => (
            <button key={p} type="button" className={pm === p ? "active" : ""} onClick={() => setPm(p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="code-block">
          <code className="mono">{SDK_INSTALL}</code>
          <button
            type="button"
            aria-label="Copy install command"
            onClick={() => handleCopy(SDK_INSTALL, "sdk_copied")}
          >
            {copied === "sdk_copied" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
          </button>
        </div>
        <FlowStepNav step={2} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="apikey" className="step-panel">
        <h3>API key</h3>
        <p>Credentials and OAuth tokens stay inside Arcade.</p>
        <div className="code-block">
          <code className="mono">{API_KEY_PLACEHOLDER}</code>
          <button
            type="button"
            aria-label="Copy API key"
            onClick={() => handleCopy(API_KEY_PLACEHOLDER, "api_key_copied")}
          >
            {copied === "api_key_copied" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
          </button>
        </div>
        <button type="button" className="text-link">
          Manage API keys
        </button>
        <FlowStepNav step={3} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="action" className="step-panel">
        <h3>Choose first tool action</h3>
        <div className="tool-action-cards">
          {TOOL_ACTIONS.map((t) => (
            <div key={t.action} className="tool-action-card">
              <div className="tool-action-header">
                <span className="mono">{t.action}</span>
                <StatusBadge status="needs_auth" small />
              </div>
              <div className="tool-action-app">
                <BrandLogo name={t.app} size={16} />
                <span>{t.app}</span>
              </div>
              <div className="tool-action-meta">
                <span className="chip">OAuth</span>
                <span className="chip">Risk: {t.risk}</span>
                <span className="chip">Sandbox</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => markSetupStep("tool_action_selected")}
              >
                Connect {t.app}
              </button>
            </div>
          ))}
        </div>
        <FlowStepNav step={4} setStep={setStep} max={STEPS.length - 1} />
      </div>,
      <div key="permissions" className="step-panel">
        <h3>Review required permissions</h3>
        <p>The model never sees the user&apos;s token. Arcade manages OAuth flow, refresh, and secure storage.</p>
        <ul className="scope-list mono">
          <li>repo:read</li>
          <li>issues:write</li>
        </ul>
        <FlowStepNav
          step={5}
          setStep={setStep}
          max={STEPS.length - 1}
          nextLabel="Authorize GitHub"
          onNext={() => {
            markSetupStep("auth_completed");
            setStep(6);
          }}
        />
      </div>,
      <div key="run" className="step-panel">
        <h3>Run locally</h3>
        <p>Framework: {framework}</p>
        <div className="code-block code-block-tall">
          <pre className="mono">{RUN_CODE}</pre>
          <button
            type="button"
            aria-label="Copy code"
            onClick={() => handleCopy(RUN_CODE, "code_copied")}
          >
            {copied === "code_copied" ? <Check size={16} weight="bold" /> : <Copy size={16} />}
          </button>
        </div>
        <FlowStepNav
          step={6}
          setStep={setStep}
          max={STEPS.length - 1}
          nextLabel="Run locally"
          onNext={() => {
            markSetupStep("first_run_received");
            setStep(7);
          }}
        />
      </div>,
      <div key="trace" className="step-panel step-success">
        <h3>Your first authorized tool call worked.</h3>
        <p>GitHub.CreateIssue ran on behalf of the user. Arcade logged the full trace.</p>
        <div className="next-steps">
          <span>Next:</span>
          <button type="button" className="chip">
            Deploy to test users
          </button>
          <button type="button" className="chip">
            Invite members
          </button>
          <button type="button" className="chip">
            Set policy
          </button>
        </div>
        <FlowStepNav step={7} setStep={setStep} max={STEPS.length - 1} hideNext />
      </div>,
    ],
    [framework, pm, playgroundPrompt, copied, handleCopy, markSetupStep],
  );

  return (
    <FlowShell
      title="Build in code"
      subtitle="Set up your framework, connect tools, and run your first authorized call."
      steps={STEPS}
      currentStep={step}
      panels={panels}
      onStepClick={(i) => i <= step && setStep(i)}
      onBack={goBack}
      headerTitle="Build Agent"
      onFinish={finishFlow}
      showFinish={step === 7}
      tracePanel={
        <LiveTracePanel status={step >= 7 ? "complete" : "waiting"} steps={traceSteps} />
      }
    />
  );
}
