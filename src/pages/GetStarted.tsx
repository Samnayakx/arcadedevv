import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  CalendarBlank,
  Check,
  CheckCircle,
  Circle,
  Code,
  EnvelopeSimple,
  PlayCircle,
  PlugsConnected,
  PuzzlePiece,
  TerminalWindow,
} from "@phosphor-icons/react";
import { fadeUp } from "../app/motion";
import { OnboardingShell } from "../components/chrome/OnboardingShell";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { useApp } from "../context/AppContext";
import type { Screen } from "../types";

type PathId = "playground" | "gateway" | "build";

interface BundleTool {
  name: string;
  connected: boolean;
}

interface GoalOption {
  id: string;
  icon: typeof Bug;
  title: string;
  subtitle: string;
  tools: BundleTool[];
  recommendedPath: PathId;
}

interface PathOption {
  id: PathId;
  screen: Screen;
  icon: typeof PlayCircle;
  title: string;
  subtitle: string;
  bestFor: string;
  cta: string;
}

const goals: GoalOption[] = [
  {
    id: "triage",
    icon: Bug,
    title: "Triage inbound issues",
    subtitle: "Label, route, and reply to new issues and tickets as they land.",
    tools: [
      { name: "GitHub", connected: true },
      { name: "Linear", connected: false },
      { name: "Slack", connected: false },
    ],
    recommendedPath: "playground",
  },
  {
    id: "inbox",
    icon: EnvelopeSimple,
    title: "Stay on top of inbox",
    subtitle: "Summarize, draft, and clear email without leaving your flow.",
    tools: [
      { name: "Gmail", connected: false },
      { name: "Slack", connected: false },
    ],
    recommendedPath: "playground",
  },
  {
    id: "plan",
    icon: CalendarBlank,
    title: "Plan my day",
    subtitle: "Pull calendar and mail into one prioritized daily brief.",
    tools: [
      { name: "Calendar", connected: false },
      { name: "Gmail", connected: false },
    ],
    recommendedPath: "playground",
  },
  {
    id: "tool",
    icon: PuzzlePiece,
    title: "Start from a tool",
    subtitle: "Browse 100+ tools and run a single authorized action.",
    tools: [
      { name: "GitHub", connected: true },
      { name: "Slack", connected: false },
      { name: "Gmail", connected: false },
    ],
    recommendedPath: "playground",
  },
  {
    id: "code",
    icon: Code,
    title: "Start from code",
    subtitle: "Wire Arcade into your own agent and call execute() directly.",
    tools: [
      { name: "LangChain", connected: false },
      { name: "Vercel AI SDK", connected: false },
      { name: "OpenAI", connected: false },
    ],
    recommendedPath: "build",
  },
];

const paths: Record<PathId, PathOption> = {
  playground: {
    id: "playground",
    screen: "playground",
    icon: PlayCircle,
    title: "Try in Playground",
    subtitle: "Run one action safely and inspect the full execution trace.",
    bestFor: "Proving Arcade can execute before you wire anything up.",
    cta: "Open Playground",
  },
  gateway: {
    id: "gateway",
    screen: "gateway",
    icon: PlugsConnected,
    title: "Connect to Cursor / Claude",
    subtitle: "Expose these tools through an MCP Gateway from one URL.",
    bestFor: "Teams who already work inside an AI client.",
    cta: "Create gateway",
  },
  build: {
    id: "build",
    screen: "build",
    icon: TerminalWindow,
    title: "Build into my app",
    subtitle: "Copy SDK code and call execute() from your own backend.",
    bestFor: "Developers building with LangChain, Mastra, or the AI SDK.",
    cta: "Set up framework",
  },
};

const pathOrder: PathId[] = ["playground", "gateway", "build"];

const stepperItems = [
  { id: "goal", label: "Pick a goal", caption: "What you want to get done" },
  { id: "use", label: "Choose how to use it", caption: "Playground, client, or code" },
  { id: "run", label: "Connect & run", caption: "Authorize, execute, inspect trace" },
];

function OnboardingStepper({ activeStep }: { activeStep: number }) {
  return (
    <aside className="goal-stepper" aria-label="Onboarding progress">
      <ol>
        {stepperItems.map((item, index) => {
          const done = index < activeStep;
          const active = index === activeStep;
          return (
            <li
              key={item.id}
              className={`goal-step${active ? " goal-step-active" : ""}${
                done ? " goal-step-done" : ""
              }`}
            >
              <span className="goal-step-marker" aria-hidden>
                {done ? <Check size={12} weight="bold" /> : index + 1}
              </span>
              <span className="goal-step-text">
                <span className="goal-step-label">{item.label}</span>
                <span className="goal-step-caption">{item.caption}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

function GoalCard({ goal, onSelect }: { goal: GoalOption; onSelect: () => void }) {
  const Icon = goal.icon;
  return (
    <button type="button" className="goal-card" onClick={onSelect}>
      <Icon className="goal-card-icon" size={20} weight="regular" aria-hidden />
      <h2 className="goal-card-title">{goal.title}</h2>
      <p className="goal-card-desc">{goal.subtitle}</p>
      <div className="goal-card-tools">
        {goal.tools.map((tool) => (
          <span key={tool.name} className="goal-tool-chip">
            <BrandLogo name={tool.name} size="sm" />
            {tool.name}
          </span>
        ))}
      </div>
      <span className="goal-card-cta">
        Choose this goal
        <ArrowRight size={14} weight="bold" />
      </span>
    </button>
  );
}

function PathCard({
  path,
  recommended,
  selected,
  onSelect,
}: {
  path: PathOption;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = path.icon;
  return (
    <button
      type="button"
      className={`path-card${recommended ? " path-card-recommended" : ""}${
        selected ? " path-card-selected" : ""
      }`}
      onClick={onSelect}
      disabled={selected}
    >
      {recommended && <span className="route-badge">Recommended</span>}
      <Icon className="path-card-icon" size={20} weight="regular" aria-hidden />
      <h3 className="path-card-title">{path.title}</h3>
      <p className="path-card-desc">{path.subtitle}</p>
      <div className="path-card-meta">
        <span className="path-card-meta-label">Best for</span>
        <span className="path-card-meta-value">{path.bestFor}</span>
      </div>
      <span className="path-card-cta">
        {selected ? "Starting…" : path.cta}
        {!selected && <ArrowRight size={14} weight="bold" />}
      </span>
    </button>
  );
}

export function GetStarted() {
  const { setScreen, exploreDashboard, organizationName, projectName, setOnboardingGoal } =
    useApp();
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [selectedPath, setSelectedPath] = useState<PathId | null>(null);

  const activeStep = selectedGoal ? 1 : 0;

  const handleGoal = (goal: GoalOption) => {
    setSelectedGoal(goal);
    setSelectedPath(null);
    setOnboardingGoal(goal.id);
  };

  const handleBackToGoals = () => {
    setSelectedGoal(null);
    setSelectedPath(null);
  };

  const handlePath = (path: PathOption) => {
    if (selectedPath) return;
    setSelectedPath(path.id);
    window.setTimeout(() => setScreen(path.screen), 400);
  };

  return (
    <OnboardingShell
      headerTrail={`${organizationName} / ${projectName}`}
      orgBadge="FREE"
      onBack={selectedGoal ? handleBackToGoals : undefined}
    >
      <div className="goal-onboarding">
        <OnboardingStepper activeStep={activeStep} />

        <div className="goal-main">
          <AnimatePresence mode="wait">
            {!selectedGoal ? (
              <motion.div key="goal-step" {...fadeUp}>
                <header className="goal-hero">
                  <h1>What do you want to get done?</h1>
                  <p>
                    Pick an outcome. We&apos;ll help you test the right tools, verify
                    auth, and then choose how to use them.
                  </p>
                </header>

                <div className="goal-grid">
                  {goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onSelect={() => handleGoal(goal)} />
                  ))}
                </div>

                <footer className="goal-footer">
                  <button
                    type="button"
                    className="route-footer-link route-footer-link-muted"
                    onClick={exploreDashboard}
                  >
                    Explore dashboard first
                  </button>
                </footer>
              </motion.div>
            ) : (
              <motion.div key="path-step" {...fadeUp}>
                <header className="goal-hero goal-hero-compact">
                  <button
                    type="button"
                    className="goal-back-inline"
                    onClick={handleBackToGoals}
                  >
                    <ArrowLeft size={14} weight="bold" />
                    Goals
                  </button>
                  <h1>How do you want to use this?</h1>
                  <p>
                    For <strong>{selectedGoal.title.toLowerCase()}</strong> we&apos;ll
                    prepare this tool bundle. Pick where to run your first action — you
                    can change paths anytime.
                  </p>
                </header>

                <div className="goal-bundle">
                  <span className="goal-bundle-label">Proposed tools</span>
                  <div className="goal-bundle-list">
                    {selectedGoal.tools.map((tool) => (
                      <span key={tool.name} className="goal-bundle-tool">
                        <BrandLogo name={tool.name} size="sm" />
                        <span className="goal-bundle-name">{tool.name}</span>
                        <span
                          className={`goal-bundle-status${
                            tool.connected ? " is-connected" : ""
                          }`}
                        >
                          {tool.connected ? (
                            <>
                              <CheckCircle size={12} weight="fill" />
                              Connected
                            </>
                          ) : (
                            <>
                              <Circle size={12} weight="regular" />
                              Needs auth
                            </>
                          )}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="path-grid">
                  {pathOrder.map((id) => (
                    <PathCard
                      key={id}
                      path={paths[id]}
                      recommended={selectedGoal.recommendedPath === id}
                      selected={selectedPath === id}
                      onSelect={() => handlePath(paths[id])}
                    />
                  ))}
                </div>

                <footer className="goal-footer">
                  <span className="goal-footer-note">
                    Recommended: start in the Playground to prove Arcade can execute
                    safely, then save it, add it to a gateway, or copy the SDK code.
                  </span>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </OnboardingShell>
  );
}
