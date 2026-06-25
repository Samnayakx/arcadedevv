import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Circle } from "@phosphor-icons/react";
import clsx from "clsx";
import { useApp } from "../../context/AppContext";
import type { SetupStepKey } from "../../types";

const SETUP_TRACK: Array<{ key: SetupStepKey; label: string }> = [
  { key: "framework_selected", label: "Framework selected" },
  { key: "sdk_copied", label: "SDK installed" },
  { key: "api_key_copied", label: "API key copied" },
  { key: "tool_action_selected", label: "Tool action selected" },
  { key: "auth_completed", label: "Authorization completed" },
  { key: "code_copied", label: "Code copied" },
  { key: "first_run_received", label: "First run received" },
  { key: "trace_created", label: "Trace created" },
];

export function AgentSetupBanner() {
  const { setupState, setScreen } = useApp();
  const completed = SETUP_TRACK.filter((step) => setupState[step.key]).length;

  return (
    <motion.div
      className="agent-setup-banner dashboard-card"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="agent-setup-banner-head">
        <div className="agent-setup-banner-heading">
          <span className="agent-setup-banner-eyebrow">
            <span className="agent-setup-pulse" aria-hidden />
            Agent setup started
          </span>
          <h3>Waiting for first run</h3>
        </div>
        <span className="agent-setup-banner-progress mono">{completed}/{SETUP_TRACK.length}</span>
      </div>

      <ol className="agent-setup-track" aria-label="Setup state">
        {SETUP_TRACK.map((step) => {
          const done = setupState[step.key];
          return (
            <li
              key={step.key}
              className={clsx("agent-setup-step", done && "agent-setup-step-done")}
            >
              {done ? (
                <CheckCircle size={15} weight="fill" color="var(--success)" aria-hidden />
              ) : (
                <Circle size={15} color="var(--text-muted)" aria-hidden />
              )}
              <span>{step.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="agent-setup-next">
        <span className="agent-setup-next-label">Next action</span>
        <p className="agent-setup-next-copy">Run your local agent and watch for trace.</p>
        <button
          type="button"
          className="btn btn-primary btn-sm agent-setup-resume"
          onClick={() => setScreen("build")}
        >
          Resume setup
          <ArrowRight size={14} weight="bold" aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}
