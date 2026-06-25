import {
  ArrowSquareOut,
  CaretDown,
  CheckCircle,
  FileText,
  Key,
  TerminalWindow,
  Wrench,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  getDefaultExecuteTool,
  getPlaygroundToolDefinition,
  getPlaygroundToolMeta,
  getPlaygroundToolRequirements,
  getToolDisplayName,
  type TraceScenario,
} from "../../data/mockPlayground";
import { WORKSPACE_ORGS, WORKSPACE_PROJECTS } from "../../data/mockWorkspace";
import type { LiveTraceStep, PlaygroundTraceStatus } from "../../hooks/usePlaygroundSession";
import { BrandLogo } from "../primitives/BrandLogo";
import { Btn } from "../primitives/Btn";
import { Icon } from "../primitives/Icon";
import { PlaygroundToolCatalogOverlay } from "./PlaygroundToolCatalogOverlay";

type ParamValues = Record<string, string | boolean>;

function buildParamDefaults(action: string): ParamValues {
  const definition = getPlaygroundToolDefinition(action);
  return Object.fromEntries(
    definition.params.map((param) => {
      if (param.type === "boolean") {
        return [param.name, param.defaultValue === "true"];
      }
      return [param.name, param.defaultValue ?? ""];
    }),
  );
}

function statusLabel(status: PlaygroundTraceStatus, isRunning: boolean) {
  if (isRunning || (status !== "idle" && status !== "success")) return "Running";
  if (status === "success") return "Success";
  return "Ready";
}

function footerHint(status: PlaygroundTraceStatus, isRunning: boolean) {
  if (isRunning || (status !== "idle" && status !== "success")) return "Executing tool call…";
  if (status === "success") return "Execution complete";
  return "Use Authorize & Run in setup";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");
}

export function PlaygroundExecuteView({
  selectedTool,
  onSelectTool,
  scenario,
  isRunning,
  traceStatus,
  traceSteps,
  onExecute,
}: {
  selectedTool: string | null;
  onSelectTool: (action: string) => void;
  scenario: TraceScenario | null;
  isRunning: boolean;
  traceStatus: PlaygroundTraceStatus;
  traceSteps: LiveTraceStep[];
  onExecute: (toolAction: string) => void;
}) {
  const activeTool = selectedTool ?? getDefaultExecuteTool();
  const toolMeta = getPlaygroundToolMeta(activeTool);
  const definition = getPlaygroundToolDefinition(activeTool);
  const requirements = getPlaygroundToolRequirements(activeTool);
  const displayName = getToolDisplayName(activeTool);

  const [params, setParams] = useState<ParamValues>(() => buildParamDefaults(activeTool));
  const [requirementsTab, setRequirementsTab] = useState<"requirements" | "connect">("requirements");
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    setParams(buildParamDefaults(activeTool));
    setRequirementsTab("requirements");
  }, [activeTool]);

  const handleExecute = () => {
    if (!activeTool || isRunning) return;
    onExecute(activeTool);
  };

  const outputLines = useMemo(() => {
    if (traceStatus === "success" && scenario) {
      return [
        scenario.assistantResult,
        "",
        scenario.sdkSnippet,
      ];
    }
    if (traceSteps.length > 0) {
      return traceSteps.map((step) => `${step.done ? "✓" : "…"} ${step.label}`);
    }
    return [];
  }, [scenario, traceStatus, traceSteps]);

  const orgSlug = slugify(WORKSPACE_ORGS[0]?.name ?? "org");
  const projectSlug = slugify(WORKSPACE_PROJECTS[0]?.name ?? "project");
  const version = toolMeta?.version ?? "1.0.0";

  return (
    <div className="playground-execute-workspace">
      <section className="playground-execute-setup" aria-label="Tool setup">
        <header className="playground-execute-section-head">
          <Icon icon={Wrench} size="sm" weight="bold" aria-hidden />
          <span>Tool setup</span>
        </header>

        <div className="playground-execute-section-body">
          <div className="playground-execute-field">
            <div className="playground-execute-field-row">
              <span className="playground-execute-field-label">Select tool</span>
              <a href="https://docs.arcade.dev" className="playground-execute-docs-link" target="_blank" rel="noreferrer">
                Docs
                <Icon icon={ArrowSquareOut} size="xs" aria-hidden />
              </a>
            </div>

            <button
              type="button"
              className="playground-execute-tool-picker"
              aria-haspopup="dialog"
              aria-expanded={catalogOpen}
              onClick={() => setCatalogOpen(true)}
            >
              {toolMeta && <BrandLogo name={toolMeta.app} size="md" className="playground-execute-tool-logo" />}
              <div className="playground-execute-tool-picker-copy">
                <span className="playground-execute-tool-select-label">{displayName}</span>
                <span className="playground-execute-tool-meta">
                  {toolMeta?.app ?? "Tool"}
                  {version ? ` • ${version}` : ""}
                </span>
              </div>
              <CaretDown size={14} className="playground-execute-tool-caret" aria-hidden />
            </button>
            <p className="playground-execute-tool-title mono">{activeTool}</p>
          </div>

          <PlaygroundToolCatalogOverlay
            open={catalogOpen}
            activeAction={activeTool}
            onClose={() => setCatalogOpen(false)}
            onSelectTool={onSelectTool}
          />

          <div className="playground-execute-requirements">
            <div className="playground-execute-req-tabs" role="tablist" aria-label="Requirements">
              <button
                type="button"
                role="tab"
                className={clsx("playground-execute-req-tab", requirementsTab === "requirements" && "active")}
                aria-selected={requirementsTab === "requirements"}
                onClick={() => setRequirementsTab("requirements")}
              >
                Requirements
                {requirementsTab === "requirements" && <span className="tab-underline" aria-hidden />}
              </button>
              <button
                type="button"
                role="tab"
                className={clsx("playground-execute-req-tab", requirementsTab === "connect" && "active")}
                aria-selected={requirementsTab === "connect"}
                onClick={() => setRequirementsTab("connect")}
              >
                Connect account
                {requirementsTab === "connect" && <span className="tab-underline" aria-hidden />}
              </button>
            </div>

            {requirementsTab === "requirements" ? (
              <div className="playground-execute-req-panel">
                <div className="playground-execute-req-row">
                  <div className="playground-execute-req-row-head">
                    <span className="playground-execute-req-label">OAuth Provider</span>
                    {requirements.oauthConfigured && (
                      <span className="playground-execute-req-status">
                        <Icon icon={CheckCircle} size="xs" weight="fill" aria-hidden />
                        Configured
                      </span>
                    )}
                  </div>
                  <div className="playground-execute-req-row-body">
                    <span className="mono playground-execute-req-provider">{requirements.oauthProvider}</span>
                    <Btn variant="link" size="sm">Connect</Btn>
                  </div>
                </div>

                <div className="playground-execute-req-row">
                  <div className="playground-execute-req-row-head">
                    <span className="playground-execute-req-label">API Keys &amp; Secrets</span>
                    {requirements.secretsConfigured && (
                      <span className="playground-execute-req-status">
                        <Icon icon={CheckCircle} size="xs" weight="fill" aria-hidden />
                        All configured
                      </span>
                    )}
                  </div>
                  {requirements.secrets.length > 0 && (
                    <div className="playground-execute-secret-list">
                      {requirements.secrets.map((secret) => (
                        <span key={secret} className="playground-execute-secret-pill mono">
                          {secret}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="playground-execute-req-panel playground-execute-req-panel-connect">
                <p className="playground-execute-connect-copy">
                  Connect your {toolMeta?.app ?? "tool"} account to authorize scoped tool calls for this workspace.
                </p>
                <Btn variant="secondary" size="sm">
                  Connect {toolMeta?.app ?? "account"}
                </Btn>
              </div>
            )}
          </div>

          <div className="playground-execute-params-block">
            {definition.params.map((param) => (
              <div key={param.name} className="playground-execute-param-field">
                <label className="playground-execute-param-label" htmlFor={`param-${param.name}`}>
                  <span className="mono">{param.label}</span>
                  {param.required && <span className="playground-execute-required">*</span>}
                </label>

                {param.type === "boolean" ? (
                  <div className="playground-execute-toggle-row">
                    <button
                      id={`param-${param.name}`}
                      type="button"
                      role="switch"
                      aria-checked={Boolean(params[param.name])}
                      className={clsx(
                        "playground-execute-toggle",
                        params[param.name] && "playground-execute-toggle-on",
                      )}
                      onClick={() =>
                        setParams((prev) => ({
                          ...prev,
                          [param.name]: !prev[param.name],
                        }))
                      }
                    >
                      <span className="playground-execute-toggle-thumb" aria-hidden />
                    </button>
                    <span className="playground-execute-toggle-value">
                      {params[param.name] ? "True" : "False"}
                    </span>
                  </div>
                ) : (
                  <input
                    id={`param-${param.name}`}
                    type="text"
                    className="input playground-execute-input"
                    value={String(params[param.name] ?? "")}
                    placeholder={param.placeholder}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, [param.name]: e.target.value }))
                    }
                  />
                )}

                {param.helperText && (
                  <p className="playground-execute-param-help">{param.helperText}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <footer className="playground-execute-setup-foot">
          <Btn
            variant="primary"
            size="md"
            className="playground-execute-run-btn"
            onClick={handleExecute}
            disabled={isRunning}
            loading={isRunning}
          >
            <Icon icon={Key} size="sm" weight="bold" aria-hidden />
            Authorize &amp; Run
          </Btn>
        </footer>
      </section>

      <section className="playground-execute-output" aria-label="Execution output">
        <header className="playground-execute-section-head playground-execute-output-head">
          <div className="playground-execute-output-title">
            <Icon icon={TerminalWindow} size="sm" weight="bold" aria-hidden />
            <span>Execution output</span>
          </div>
        </header>

        <div className="playground-execute-breadcrumbs mono">
          <span>{orgSlug}</span>
          <span className="playground-execute-crumb-sep">/</span>
          <span>{projectSlug}</span>
          <span className="playground-execute-crumb-arrow" aria-hidden>&gt;</span>
          <span className="playground-execute-crumb-action">
            {toolMeta?.app}.{displayName}@{version}
          </span>
        </div>

        <div className="playground-execute-output-main">
          <div className="playground-execute-expected">
            <div className="playground-execute-expected-head">
              <Icon icon={FileText} size="sm" aria-hidden />
              <span>Expected output</span>
              <span className="playground-execute-expected-type mono">TXT</span>
            </div>
            <p className="playground-execute-expected-copy">
              {outputLines.length > 0 ? outputLines.join("\n") : definition.expectedOutput}
            </p>
          </div>
        </div>

        <footer className="playground-execute-output-foot">
          <span>
            Status{" "}
            <strong className={clsx(traceStatus === "success" && "playground-execute-status-success")}>
              {statusLabel(traceStatus, isRunning)}
            </strong>
          </span>
          <span>{footerHint(traceStatus, isRunning)}</span>
        </footer>
      </section>
    </div>
  );
}
