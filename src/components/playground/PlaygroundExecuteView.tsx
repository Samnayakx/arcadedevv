import {
  CaretDown,
  FileText,
  Play,
  Terminal,
  Wrench,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  getDefaultConnectedTool,
  getPlaygroundToolDefinition,
  getPlaygroundToolMeta,
  PLAYGROUND_STATUS,
  PLAYGROUND_TOOLS,
  type TraceScenario,
} from "../../data/mockPlayground";
import type { LiveTraceStep, PlaygroundTraceStatus } from "../../hooks/usePlaygroundSession";
import { BrandLogo } from "../primitives/BrandLogo";

function buildParamDefaults(action: string) {
  const definition = getPlaygroundToolDefinition(action);
  return Object.fromEntries(
    definition.params.map((param) => [param.name, param.defaultValue ?? ""]),
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
  return "Press Run to execute";
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
  const connectedTools = useMemo(
    () => PLAYGROUND_TOOLS.filter((tool) => tool.connected),
    [],
  );

  const activeTool = selectedTool ?? getDefaultConnectedTool();
  const toolMeta = getPlaygroundToolMeta(activeTool);
  const definition = getPlaygroundToolDefinition(activeTool);

  const [params, setParams] = useState<Record<string, string>>(() => buildParamDefaults(activeTool));

  useEffect(() => {
    setParams(buildParamDefaults(activeTool));
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

  return (
    <div className="playground-execute-workspace">
      <section className="playground-execute-setup" aria-label="Tool setup">
        <header className="playground-execute-section-head">
          <Wrench size={14} weight="bold" aria-hidden />
          <span>Tool setup</span>
        </header>

        <div className="playground-execute-section-body">
          <div className="playground-execute-field">
            <span className="playground-execute-field-label">Select tool</span>
            <div className="playground-execute-select-wrap">
              {toolMeta && <BrandLogo name={toolMeta.app} size={16} />}
              <select
                className="playground-execute-select"
                value={activeTool}
                onChange={(e) => onSelectTool(e.target.value)}
                aria-label="Select tool"
              >
                {connectedTools.map((tool) => (
                  <option key={tool.id} value={tool.action}>
                    {tool.action}
                  </option>
                ))}
              </select>
              <CaretDown size={12} className="playground-execute-select-icon" aria-hidden />
            </div>
          </div>

          <div className="playground-execute-field">
            <span className="playground-execute-field-label">Tool overview</span>
            <p className="playground-execute-overview">{definition.description}</p>
          </div>

          <div className="playground-execute-field">
            <div className="playground-execute-params-head">
              <span className="playground-execute-field-label">Parameters</span>
              <span className="playground-execute-params-tag">Required</span>
            </div>
            <div className="playground-execute-params">
              {definition.params.map((param) => (
                <label key={param.name} className="playground-execute-param">
                  <span className="mono">{param.label}</span>
                  <input
                    type="text"
                    className="input playground-execute-input"
                    value={params[param.name] ?? ""}
                    placeholder={param.placeholder}
                    onChange={(e) =>
                      setParams((prev) => ({ ...prev, [param.name]: e.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className="playground-execute-setup-foot">
          <button
            type="button"
            className="btn btn-primary btn-md playground-execute-run-btn"
            onClick={handleExecute}
            disabled={isRunning}
          >
            <Play size={14} weight="fill" aria-hidden />
            Execute tool
          </button>
        </footer>
      </section>

      <section className="playground-execute-output" aria-label="Execution output">
        <header className="playground-execute-section-head playground-execute-output-head">
          <div className="playground-execute-output-title">
            <Terminal size={14} weight="bold" aria-hidden />
            <span>Execution output</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm playground-execute-run-secondary"
            onClick={handleExecute}
            disabled={isRunning}
          >
            <Play size={12} weight="fill" aria-hidden />
            Run
          </button>
        </header>

        <div className="playground-execute-breadcrumbs mono">
          <span>{PLAYGROUND_STATUS.environment}</span>
          <span className="playground-execute-crumb-sep">/</span>
          <span>{toolMeta?.app ?? "Tool"}</span>
          <span className="playground-execute-crumb-sep">/</span>
          <span>{activeTool}</span>
        </div>

        <div className="playground-execute-expected">
          <div className="playground-execute-expected-head">
            <FileText size={13} aria-hidden />
            <span>Expected output</span>
            <span className="playground-execute-expected-type mono">TXT</span>
          </div>
          <p className="playground-execute-expected-copy">{definition.expectedOutput}</p>
        </div>

        <div
          className={clsx(
            "playground-execute-output-body",
            outputLines.length === 0 && "playground-execute-output-body-empty",
          )}
        >
          {outputLines.length > 0 ? (
            <pre className="mono playground-execute-output-pre">{outputLines.join("\n")}</pre>
          ) : (
            <p className="playground-execute-output-placeholder">
              Output will appear here after you run the tool.
            </p>
          )}
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
