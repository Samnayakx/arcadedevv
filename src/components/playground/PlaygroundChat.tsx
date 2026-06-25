import { ArrowUp, GitBranch } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { BrandLogo } from "../primitives/BrandLogo";
import {
  getPlaygroundToolCounts,
  PLAYGROUND_PROMPTS,
  PLAYGROUND_TOOLS,
} from "../../data/mockPlayground";
import type { GoalSuggestion } from "../../data/playgroundContext";
import type { PlaygroundMessage, PlaygroundRun } from "../../hooks/usePlaygroundSession";
import type { TracePreview } from "../../types";
import { PlaygroundDeployCTA } from "./PlaygroundDeployCTA";
import { PlaygroundTraceCanvas } from "./PlaygroundTraceCanvas";
import { TOOL_DRAG_MIME } from "./PlaygroundToolPanel";

const HINT_KEY = "playground-hint-dismissed";

export function PlaygroundChat({
  messages,
  message,
  setMessage,
  isRunning,
  lastPrompt,
  tracePreview,
  seedSuggestions,
  runs,
  selectedRunId,
  onSelectRun,
  onSend,
  onSendPrompt,
  onPromptClick,
  onRunAgain,
  toolsOpen,
  onToggleTools,
  onInsertTool,
}: {
  messages: PlaygroundMessage[];
  message: string;
  setMessage: (value: string) => void;
  isRunning: boolean;
  lastPrompt: string;
  tracePreview: TracePreview | null;
  seedSuggestions: GoalSuggestion[];
  runs: PlaygroundRun[];
  selectedRunId: string | null;
  onSelectRun: (id: string) => void;
  onSend: () => void;
  onSendPrompt: (text: string) => void;
  onPromptClick: (prompt: (typeof PLAYGROUND_PROMPTS)[number]) => void;
  onRunAgain: () => void;
  toolsOpen: boolean;
  onToggleTools: () => void;
  onInsertTool: (action: string) => void;
}) {
  const [hintDismissed, setHintDismissed] = useState(false);
  const [isToolDragOver, setIsToolDragOver] = useState(false);
  const canSend = message.trim().length > 0 && !isRunning;
  const hasThread = messages.length > 0;

  const connectedApps = [
    ...new Set(PLAYGROUND_TOOLS.filter((tool) => tool.connected).map((tool) => tool.app)),
  ];
  const previewApps = connectedApps.slice(0, 3);
  const extraApps = Math.max(0, connectedApps.length - previewApps.length);
  const toolCount = getPlaygroundToolCounts().connectedActive;

  const handleToolDragOver = (event: React.DragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes(TOOL_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsToolDragOver(true);
  };

  const handleToolDragLeave = (event: React.DragEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsToolDragOver(false);
  };

  const handleToolDrop = (event: React.DragEvent<HTMLElement>) => {
    const action =
      event.dataTransfer.getData(TOOL_DRAG_MIME) || event.dataTransfer.getData("text/plain");
    setIsToolDragOver(false);
    if (!action) return;
    event.preventDefault();
    onInsertTool(action);
  };

  useEffect(() => {
    if (sessionStorage.getItem(HINT_KEY) === "1") {
      setHintDismissed(true);
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <section
      className={clsx(
        "playground-chat",
        hasThread && "playground-chat-has-thread",
        isToolDragOver && "playground-chat-dragover",
      )}
      aria-label="Test prompt"
      onDragOver={handleToolDragOver}
      onDragLeave={handleToolDragLeave}
      onDrop={handleToolDrop}
    >
      <div className={clsx("playground-chat-body", hasThread && "playground-chat-body-thread")}>
        <div className="playground-chat-center">
          {!hasThread && (
            <div className="playground-empty">
              <h1 className="playground-empty-title">Hi Sambit, let's build something cool</h1>
              {!hintDismissed && (
                <p className="playground-empty-hint">
                  Test tool calls here before deploying agents.{" "}
                  <button
                    type="button"
                    className="playground-empty-hint-dismiss"
                    onClick={() => {
                      sessionStorage.setItem(HINT_KEY, "1");
                      setHintDismissed(true);
                    }}
                  >
                    Dismiss
                  </button>
                </p>
              )}

              <div className="playground-suggestions">
                {seedSuggestions.length > 0
                  ? seedSuggestions.map((prompt) => (
                      <button
                        key={prompt.prompt}
                        type="button"
                        className="playground-suggestion"
                        onClick={() => onSendPrompt(prompt.prompt)}
                      >
                        {prompt.brand && (
                          <span className="playground-suggestion-icon">
                            <BrandLogo name={prompt.brand} size={22} />
                          </span>
                        )}
                        <span className="playground-suggestion-title">{prompt.label}</span>
                        {prompt.sub && (
                          <span className="playground-suggestion-sub">{prompt.sub}</span>
                        )}
                      </button>
                    ))
                  : PLAYGROUND_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.id}
                        type="button"
                        className="playground-suggestion"
                        onClick={() => onPromptClick(prompt)}
                      >
                        <span className="playground-suggestion-icon">
                          <BrandLogo name={prompt.brand} size={22} />
                        </span>
                        <span className="playground-suggestion-title">{prompt.title}</span>
                        <span className="playground-suggestion-sub">{prompt.subtitle}</span>
                      </button>
                    ))}
              </div>
            </div>
          )}

          {hasThread && (
            <>
              {tracePreview && (
                <div className="playground-chat-trace">
                  <span className="playground-chat-trace-label">Execution map</span>
                  <PlaygroundTraceCanvas preview={tracePreview} />
                </div>
              )}

              <ul className="playground-messages" aria-live="polite">
              {messages.map((msg) => {
                const run = msg.runId ? runs.find((r) => r.id === msg.runId) : undefined;
                return (
                <li
                  key={msg.id}
                  className={clsx(
                    "playground-message",
                    msg.role === "user" ? "playground-message-user" : "playground-message-assistant",
                  )}
                >
                  <p className="playground-message-text">{msg.content}</p>
                  {run && (
                    <button
                      type="button"
                      className={clsx(
                        "playground-trace-chip",
                        selectedRunId === run.id && "is-selected",
                      )}
                      onClick={() => onSelectRun(run.id)}
                      title="Show this run in the trace panel"
                    >
                      <GitBranch size={12} weight="bold" />
                      <span className="mono">{run.toolAction}</span>
                      <span className="playground-trace-chip-label">
                        {selectedRunId === run.id ? "viewing trace" : "view trace"}
                      </span>
                    </button>
                  )}
                </li>
                );
              })}
              {isRunning && (
                <li className="playground-message playground-message-assistant playground-message-thinking">
                  <p>Running…</p>
                </li>
              )}
              </ul>

              {messages.some((msg) => msg.showDeployCta) && lastPrompt && (
                <PlaygroundDeployCTA prompt={lastPrompt} onRunAgain={onRunAgain} />
              )}

              {seedSuggestions.length > 0 && !isRunning && (
                <div className="playground-followups" aria-label="Suggested follow-ups">
                  {seedSuggestions.map((prompt) => (
                    <button
                      key={prompt.prompt}
                      type="button"
                      className="playground-followup"
                      onClick={() => onSendPrompt(prompt.prompt)}
                    >
                      {prompt.brand && <BrandLogo name={prompt.brand} size={12} />}
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="playground-composer">
        <div className="playground-composer-center">
          <div className="playground-composer-inner">
            <textarea
              className="playground-composer-input"
              placeholder="Describe a task for your agent…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isRunning}
            />
            <div className="playground-composer-actions">
              <button
                type="button"
                className={clsx(
                  "playground-composer-tools-btn",
                  toolsOpen && "playground-composer-tools-btn-active",
                )}
                aria-pressed={toolsOpen}
                title={toolsOpen ? "Hide tools" : "Show tools"}
                onClick={onToggleTools}
              >
                <span className="playground-tools-avatars" aria-hidden>
                  {previewApps.map((app) => (
                    <span key={app} className="playground-tools-avatar">
                      <BrandLogo name={app} size={15} />
                    </span>
                  ))}
                  {extraApps > 0 && (
                    <span className="playground-tools-avatar playground-tools-avatar-more">
                      +{extraApps}
                    </span>
                  )}
                </span>
                <span className="playground-tools-label">Tools</span>
                <span className="playground-tools-count">{toolCount}</span>
              </button>
              <button
                type="button"
                className={clsx(
                  "playground-send-btn",
                  canSend && "playground-send-btn-active btn btn-primary",
                )}
                aria-label="Send message"
                disabled={!canSend}
                onClick={onSend}
              >
                <ArrowUp size={16} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
