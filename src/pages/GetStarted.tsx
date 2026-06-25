import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlugsConnected,
  PlayCircle,
  TerminalWindow,
} from "@phosphor-icons/react";
import { fadeUp } from "../app/motion";
import { OnboardingShell } from "../components/chrome/OnboardingShell";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { useApp } from "../context/AppContext";
import type { Screen } from "../types";

type PathId = "build" | "gateway" | "sandbox";

interface PathOption {
  id: PathId;
  screen: Screen;
  icon: typeof TerminalWindow;
  title: string;
  subtitle: string;
  bestFor: string;
  pathSteps: string[];
  pills: string[];
  cta: string;
  recommended?: boolean;
  helperLabel: string;
}

const paths: PathOption[] = [
  {
    id: "build",
    screen: "build",
    icon: TerminalWindow,
    title: "Build in code",
    subtitle: "Use Arcade inside your own agent app.",
    bestFor:
      "Developers building with LangChain, Mastra, Vercel AI SDK, or custom backends.",
    pathSteps: ["Framework", "API key", "Tool call", "Trace"],
    pills: ["LangChain", "Mastra", "Vercel AI SDK", "Custom"],
    cta: "Set up framework",
    helperLabel: "I'm building an app",
  },
  {
    id: "gateway",
    screen: "gateway",
    icon: PlugsConnected,
    title: "Connect an AI client",
    subtitle: "Create an MCP Gateway for Cursor, Claude, Windsurf, or VS Code.",
    bestFor: "Teams who already work inside AI clients.",
    pathSteps: ["Goal", "Tools", "Gateway", "Client config", "Logs"],
    pills: ["Cursor", "Claude", "Windsurf", "VS Code"],
    cta: "Create gateway",
    helperLabel: "I use Cursor / Claude",
  },
  {
    id: "sandbox",
    screen: "sandbox",
    icon: PlayCircle,
    title: "Try a tool call",
    subtitle: "Run one sandbox action and inspect the trace.",
    bestFor: "Evaluating Arcade before setup.",
    pathSteps: ["Action", "Permission", "Sandbox run", "Trace"],
    pills: ["GitHub", "Slack", "Gmail", "Airtable"],
    cta: "Run sandbox test",
    recommended: true,
    helperLabel: "I'm just exploring",
  },
];

function PathCard({
  path,
  selected,
  highlighted,
  onSelect,
}: {
  path: PathOption;
  selected: boolean;
  highlighted?: boolean;
  onSelect: () => void;
}) {
  const Icon = path.icon;

  return (
    <button
      type="button"
      className={`route-card${selected ? " route-card-selected" : ""}${
        highlighted ? " route-card-highlight" : ""
      }${path.recommended ? " route-card-recommended" : ""}`}
      onClick={onSelect}
      disabled={selected}
    >
      {path.recommended && (
        <span className="route-badge">Recommended</span>
      )}

      <Icon className="route-card-icon" size={20} weight="regular" aria-hidden />

      <h2 className="route-card-title">{path.title}</h2>
      <p className="route-card-desc">{path.subtitle}</p>

      <div className="route-pills">
        {path.pills.map((pill) => (
          <span key={pill} className="route-pill">
            <BrandLogo name={pill} size="sm" />
            {pill}
          </span>
        ))}
      </div>

      <div className="route-meta">
        <div className="route-meta-row">
          <span className="route-meta-label">Best for</span>
          <span className="route-meta-value">{path.bestFor}</span>
        </div>
        <div className="route-meta-row">
          <span className="route-meta-label">Path</span>
          <span className="route-meta-value route-meta-path">
            {path.pathSteps.join(" → ")}
          </span>
        </div>
      </div>

      <span className="route-cta">
        {selected ? "Starting…" : path.cta}
        {!selected && <ArrowRight size={14} weight="bold" />}
      </span>
    </button>
  );
}

export function GetStarted() {
  const { setScreen, exploreDashboard, organizationName, projectName } = useApp();
  const [selectedId, setSelectedId] = useState<PathId | null>(null);
  const [activeHelper, setActiveHelper] = useState<PathId | null>(null);

  const handleSelect = (path: PathOption) => {
    if (selectedId) return;
    setSelectedId(path.id);
    window.setTimeout(() => {
      setScreen(path.screen);
    }, 400);
  };

  const sandboxPath = paths[2];

  return (
    <OnboardingShell headerTrail={`${organizationName} / ${projectName}`} orgBadge="FREE">
      <motion.div className="router-page" {...fadeUp}>
        <header className="router-hero">
          <h1>How do you want to start?</h1>
          <p>
            Choose where your agent will run. Arcade will help you connect tools,
            authorize access, execute safely, and inspect the trace.
          </p>
        </header>

        <div className="route-helpers" role="group" aria-label="Quick match">
          {paths.map((path) => (
            <button
              key={path.id}
              type="button"
              className={`route-helper${
                activeHelper === path.id ? " route-helper-active" : ""
              }`}
              onMouseEnter={() => setActiveHelper(path.id)}
              onMouseLeave={() => setActiveHelper(null)}
              onFocus={() => setActiveHelper(path.id)}
              onBlur={() => setActiveHelper(null)}
              onClick={() => handleSelect(path)}
            >
              {path.helperLabel}
            </button>
          ))}
        </div>

        <div className="route-card-grid">
          {paths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              selected={selectedId === path.id}
              highlighted={activeHelper === path.id}
              onSelect={() => handleSelect(path)}
            />
          ))}
        </div>

        <footer className="route-footer">
          <button
            type="button"
            className="route-footer-link"
            onClick={() => handleSelect(sandboxPath)}
          >
            Not sure? Start with a sandbox test.
          </button>
          <span className="route-footer-sep" aria-hidden>
            ·
          </span>
          <button
            type="button"
            className="route-footer-link route-footer-link-muted"
            onClick={exploreDashboard}
          >
            Explore dashboard first
          </button>
        </footer>
      </motion.div>
    </OnboardingShell>
  );
}
