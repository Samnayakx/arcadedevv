import { ArrowUp } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { BrandLogo } from "../primitives/BrandLogo";
import { PLAYGROUND_PROMPTS } from "../../data/mockPlayground";
import type { PlaygroundMessage } from "../../hooks/usePlaygroundSession";
import type { TracePreview } from "../../types";
import { PlaygroundDeployCTA } from "./PlaygroundDeployCTA";
import { PlaygroundTraceCanvas } from "./PlaygroundTraceCanvas";

const HINT_KEY = "playground-hint-dismissed";

export function PlaygroundChat({
  messages,
  message,
  setMessage,
  isRunning,
  lastPrompt,
  tracePreview,
  onSend,
  onPromptClick,
  onRunAgain,
}: {
  messages: PlaygroundMessage[];
  message: string;
  setMessage: (value: string) => void;
  isRunning: boolean;
  lastPrompt: string;
  tracePreview: TracePreview | null;
  onSend: () => void;
  onPromptClick: (prompt: (typeof PLAYGROUND_PROMPTS)[number]) => void;
  onRunAgain: () => void;
}) {
  const [hintDismissed, setHintDismissed] = useState(false);
  const canSend = message.trim().length > 0 && !isRunning;
  const hasThread = messages.length > 0;

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
    <section className={clsx("playground-chat", hasThread && "playground-chat-has-thread")} aria-label="Test prompt">
      <div className={clsx("playground-chat-body", hasThread && "playground-chat-body-thread")}>
        <div className="playground-chat-center">
          {!hasThread && (
            <div className="playground-empty">
              <h1 className="playground-empty-title">What should we try?</h1>
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
                {PLAYGROUND_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    className="playground-suggestion"
                    onClick={() => onPromptClick(prompt)}
                  >
                    <BrandLogo name={prompt.brand} size={14} />
                    <span>
                      {prompt.title} {prompt.subtitle}
                    </span>
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
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={clsx(
                    "playground-message",
                    msg.role === "user" ? "playground-message-user" : "playground-message-assistant",
                  )}
                >
                  <p>{msg.content}</p>
                </li>
              ))}
              {isRunning && (
                <li className="playground-message playground-message-assistant playground-message-thinking">
                  <p>Running…</p>
                </li>
              )}
              </ul>

              {messages.some((msg) => msg.showDeployCta) && lastPrompt && (
                <PlaygroundDeployCTA prompt={lastPrompt} onRunAgain={onRunAgain} />
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
              rows={3}
              disabled={isRunning}
            />
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
      </footer>
    </section>
  );
}
