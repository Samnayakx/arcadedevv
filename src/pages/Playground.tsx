import {
  ArrowRight,
  ArrowUp,
  ClockCounterClockwise,
  Code,
  Plus,
  Warning,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp } from "../app/motion";
import { useApp } from "../context/AppContext";
import { BrandLogo } from "../components/primitives/BrandLogo";
import { Btn } from "../components/primitives/Btn";

const TOOL_PREVIEW = ["Gmail", "Slack", "GitHub"];
const TOOL_COUNT = 151;
const TOOL_CAP = 64;

const prompts = [
  {
    id: "gmail",
    brand: "Gmail",
    title: "Read my emails",
    subtitle: "and summarize them",
  },
  {
    id: "slack",
    brand: "Slack",
    title: "Check Slack messages",
    subtitle: "in the #general channel",
  },
  {
    id: "github",
    brand: "GitHub",
    title: "Star the arcadeai/arcade-mcp",
    subtitle: "repo on GitHub",
  },
  {
    id: "linkedin",
    brand: "LinkedIn",
    title: "Publish a new post on LinkedIn",
    subtitle: "saying that I'm testing Arcade.dev",
  },
  {
    id: "calendar",
    brand: "Calendar",
    title: "Check my schedule",
    subtitle: "for today on Google Calendar",
  },
];

function ToolsBadge({ compact }: { compact?: boolean }) {
  return (
    <div className={`playground-tools-badge${compact ? " playground-tools-badge-compact" : ""}`}>
      <div className="playground-tools-logos">
        {TOOL_PREVIEW.map((app) => (
          <span key={app} className="playground-tools-logo" title={app}>
            <BrandLogo name={app} size={compact ? 12 : 14} />
          </span>
        ))}
        <span className="playground-tools-overflow">+3</span>
      </div>
      <span className="playground-tools-label">Tools</span>
      <span className="playground-tools-count">{TOOL_COUNT}</span>
    </div>
  );
}

export function Playground() {
  const { setScreen } = useApp();
  const [mode, setMode] = useState<"chat" | "execute">("chat");
  const [message, setMessage] = useState("");

  const handlePromptClick = (prompt: (typeof prompts)[number]) => {
    setMessage(`${prompt.title} ${prompt.subtitle}`);
  };

  return (
    <div className="playground-page">
      <header className="playground-toolbar">
        <div className="playground-toolbar-left">
          <div className="playground-mode-toggle" role="tablist" aria-label="Playground mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "chat"}
              className={`playground-mode-btn${mode === "chat" ? " playground-mode-btn-active" : ""}`}
              onClick={() => setMode("chat")}
            >
              Chat
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "execute"}
              className={`playground-mode-btn${mode === "execute" ? " playground-mode-btn-active" : ""}`}
              onClick={() => setMode("execute")}
            >
              <Code size={14} weight="regular" />
              Execute
            </button>
          </div>

          <button type="button" className="playground-new-chat">
            <Plus size={14} weight="bold" />
            New Chat
          </button>

          <ToolsBadge />
        </div>

        <button type="button" className="playground-history-btn">
          <ClockCounterClockwise size={16} weight="regular" />
          History
        </button>
      </header>

      <motion.div className="playground-body" {...fadeUp}>
        <section className="playground-hero">
          <h1>
            Hi, <span className="playground-hero-name">sambit nayak</span>
          </h1>
          <p>Explore how to call tools in your agent with Arcade.</p>
          <Btn
            variant="secondary"
            size="sm"
            className="playground-hero-cta"
            onClick={() => setScreen("get-started")}
          >
            Start Building
            <ArrowRight size={14} weight="bold" />
          </Btn>
        </section>

        <div className="playground-prompts">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              className="playground-prompt-card dashboard-card"
              onClick={() => handlePromptClick(prompt)}
            >
              <span className="playground-prompt-logo">
                <BrandLogo name={prompt.brand} size={18} />
              </span>
              <span className="playground-prompt-title">{prompt.title}</span>
              <span className="playground-prompt-subtitle">{prompt.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="playground-cap-banner" role="status">
          <Warning size={16} weight="fill" className="playground-cap-icon" />
          <div className="playground-cap-copy">
            <strong>Tool selection capped</strong>
            <span>
              Using {TOOL_CAP} of {TOOL_COUNT} selected tools. Narrow the selection if you
              need a specific tool.
            </span>
          </div>
        </div>
      </motion.div>

      <footer className="playground-composer">
        <div className="playground-composer-inner dashboard-card">
          <textarea
            className="playground-composer-input"
            placeholder="Send a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
          />
          <div className="playground-composer-footer">
            <ToolsBadge compact />
            <button
              type="button"
              className="playground-send-btn"
              aria-label="Send message"
              disabled={!message.trim()}
            >
              <ArrowUp size={16} weight="bold" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
