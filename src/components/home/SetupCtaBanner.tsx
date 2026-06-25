import { motion } from "framer-motion";
import { ArrowRight, RocketLaunch, Sparkle } from "@phosphor-icons/react";
import { useApp } from "../../context/AppContext";

type SetupCtaMode = "default" | "compact" | "firstRun";

function resolveMode(compact?: boolean, firstRun?: boolean): SetupCtaMode {
  if (firstRun) return "firstRun";
  if (compact) return "compact";
  return "default";
}

export function SetupCtaBanner({
  compact,
  firstRun,
  variant = "banner",
  onViewTrace,
}: {
  compact?: boolean;
  firstRun?: boolean;
  variant?: "banner" | "card";
  onViewTrace?: () => void;
}) {
  const { setScreen } = useApp();
  const mode = resolveMode(compact, firstRun);

  const copy = {
    default: {
      title: "Create your first agent flow",
      description: "Connect one tool, run one safe action, and see the trace.",
      primary: "Choose a starting path",
      secondary: "Try sandbox tool call",
      icon: Sparkle,
    },
    compact: {
      title: "Next step: Authorize GitHub",
      description: "Your Bug Report Agent is ready, but needs GitHub access before it can run.",
      primary: "Authorize GitHub",
      secondary: null,
      icon: Sparkle,
    },
    firstRun: {
      title: "Deploy to test users",
      description: "Your agent ran successfully in sandbox. Enable it for your team to go live.",
      primary: "Enable test users",
      secondary: "View trace",
      icon: RocketLaunch,
    },
  }[mode];

  const Icon = copy.icon;

  return (
    <motion.div
      className={`setup-cta ${mode === "compact" ? "setup-cta-compact" : ""} ${
        variant === "card" ? "setup-cta-card dashboard-card" : ""
      }`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant === "card" && (
        <div className="dashboard-card-head">
          <h3>{mode === "firstRun" ? "Next step" : mode === "compact" ? "Next step" : "Get started"}</h3>
        </div>
      )}
      <div className="setup-cta-body">
        <div className="setup-cta-content">
          <Icon size={20} weight="regular" color="var(--text-dim)" />
          <div>
            <strong>{copy.title}</strong>
            <p>{copy.description}</p>
          </div>
        </div>
        <div className={`setup-cta-actions ${variant === "card" ? "setup-cta-actions-stacked" : ""}`}>
          <button type="button" className="btn btn-primary" onClick={() => setScreen("get-started")}>
            {copy.primary}
            <ArrowRight size={16} weight="bold" />
          </button>
          {copy.secondary && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => (mode === "firstRun" && onViewTrace ? onViewTrace() : setScreen("sandbox"))}
            >
              {copy.secondary}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
