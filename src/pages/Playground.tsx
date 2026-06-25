import {
  ClockCounterClockwise,
  Code,
  Plus,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useState } from "react";
import { usePlaygroundSession } from "../hooks/usePlaygroundSession";
import { PlaygroundChat } from "../components/playground/PlaygroundChat";
import { PlaygroundExecuteView } from "../components/playground/PlaygroundExecuteView";
import { PlaygroundHistoryDrawer } from "../components/playground/PlaygroundHistoryDrawer";
import { PlaygroundStatusBar } from "../components/playground/PlaygroundStatusBar";
import { PlaygroundToolPanel } from "../components/playground/PlaygroundToolPanel";
import { PlaygroundTracePanel } from "../components/playground/PlaygroundTracePanel";

export function Playground() {
  const [mode, setMode] = useState<"chat" | "execute">("chat");
  const [historyOpen, setHistoryOpen] = useState(false);

  const session = usePlaygroundSession();

  const handleNewSession = () => {
    session.resetSession();
    setMode("chat");
  };

  return (
    <div className="playground-page">
      <header className="playground-toolbar">
        <div className="playground-toolbar-inner">
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
              Test Prompt
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
              Run Agent
            </button>
          </div>

          <div className="playground-toolbar-meta">
            <PlaygroundStatusBar compact />
            <button type="button" className="playground-toolbar-btn" onClick={handleNewSession}>
              <Plus size={14} weight="bold" />
              New Session
            </button>
            <button
              type="button"
              className="playground-toolbar-btn playground-toolbar-btn-icon"
              aria-label="History"
              onClick={() => setHistoryOpen(true)}
            >
              <ClockCounterClockwise size={16} weight="regular" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="playground-workspace"
        className="playground-layout"
        role="tabpanel"
        aria-labelledby={mode === "chat" ? "playground-tab-chat" : "playground-tab-execute"}
      >
        <PlaygroundToolPanel
          onSelectTool={session.insertTool}
          selectedTool={session.selectedTool}
        />

        {mode === "chat" ? (
          <PlaygroundChat
            messages={session.messages}
            message={session.message}
            setMessage={session.setMessage}
            isRunning={session.isRunning}
            lastPrompt={session.lastPrompt}
            tracePreview={session.tracePreview}
            onSend={() => session.sendMessage()}
            onPromptClick={session.handlePromptClick}
            onRunAgain={session.runAgain}
          />
        ) : (
          <PlaygroundExecuteView scenario={session.lastScenario} lastPrompt={session.lastPrompt} />
        )}

        <PlaygroundTracePanel
          liveStatus={session.liveTraceStatus}
          steps={session.traceSteps}
        />
      </div>

      <PlaygroundHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={(prompt) => {
          session.setMessage(prompt);
        }}
      />
    </div>
  );
}
