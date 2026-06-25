import {
  ArrowUp,
  ClockCounterClockwise,
  Code,
  Plus,
  Warning,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp } from "../app/motion";
import { BrandLogo } from "../components/primitives/BrandLogo";

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
  const [mode, setMode] = useState<"chat" | "execute">("chat");
  const [message, setMessage] = useState("");
  const canSend = message.trim().length > 0;

  const handlePromptClick = (prompt: (typeof prompts)[number]) => {
    setMessage(`${prompt.title} ${prompt.subtitle}`);
  };

  return (
    <div className="playground-page dot-grid-bg">
      <header className="playground-toolbar">
        <div className="playground-shell playground-toolbar-inner">
          <div className="playground-toolbar-group">
            <div className="playground-mode-toggle" role="tablist" aria-label="Playground mode">
              <button
                type="button"
                role="tab"
                id="playground-tab-chat"
                aria-selected={mode === "chat"}
                aria-controls="playground-workspace"
                className={clsx("playground-mode-btn", mode === "chat" && "playground-mode-btn-active")}
                onClick={() => setMode("chat")}
              >
                Chat
              </button>
              <button
                type="button"
                role="tab"
                id="playground-tab-execute"
                aria-selected={mode === "execute"}
                aria-controls="playground-workspace"
                className={clsx(
                  "playground-mode-btn",
                  mode === "execute" && "playground-mode-btn-active",
                )}
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
          </div>

          <div className="playground-toolbar-actions">
            <ToolsBadge />
            <button type="button" className="playground-history-btn">
              <ClockCounterClockwise size={16} weight="regular" />
              History
            </button>
          </div>
        </div>
      </header>

      <motion.div
        id="playground-workspace"
        className="playground-body playground-shell"
        role="tabpanel"
        aria-labelledby={mode === "chat" ? "playground-tab-chat" : "playground-tab-execute"}
        {...fadeUp}
      >
        <section className="playground-hero">
          <h1>
            Hi, <span className="playground-hero-name">sambit nayak</span>
          </h1>
          <p>Explore how to call tools in your agent with Arcade.</p>
        </section>

        <div className="playground-prompts">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              className="playground-prompt-card"
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
      </motion.div>

      <footer className="playground-composer">
        <div className="playground-shell">
          <div
            className="playground-composer-inner"
            aria-describedby="playground-cap-hint"
          >
            <textarea
              className="playground-composer-input"
              placeholder="Send a message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
            />
            <div className="playground-composer-footer">
              <div className="playground-composer-meta">
                <ToolsBadge compact />
                <p id="playground-cap-hint" className="playground-cap-hint" role="status">
                  <Warning size={14} weight="fill" className="playground-cap-icon" aria-hidden />
                  <span>
                    Tool selection capped — using {TOOL_CAP} of {TOOL_COUNT} tools
                  </span>
                </p>
              </div>
              <button
                type="button"
                className={clsx(
                  "playground-send-btn",
                  canSend && "playground-send-btn-active btn btn-primary",
                )}
                aria-label="Send message"
                disabled={!canSend}
              >
                <ArrowUp size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
