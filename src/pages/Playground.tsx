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
import { Btn } from "../components/primitives/Btn";
import { Icon } from "../components/primitives/Icon";

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
          <div className="playground-mode-toggle tab-bar" role="tablist" aria-label="Playground mode">
            <button
              type="button"
              role="tab"
              id="playground-tab-chat"
              aria-selected={mode === "chat"}
              aria-controls="playground-workspace"
              className={clsx("tab", mode === "chat" && "active")}
              onClick={() => setMode("chat")}
            >
              Test Prompt
              {mode === "chat" && <span className="tab-underline" aria-hidden />}
            </button>
            <button
              type="button"
              role="tab"
              id="playground-tab-execute"
              aria-selected={mode === "execute"}
              aria-controls="playground-workspace"
              className={clsx("tab", mode === "execute" && "active")}
              onClick={() => setMode("execute")}
            >
              <Icon icon={Code} size="sm" aria-hidden />
              Run Agent
              {mode === "execute" && <span className="tab-underline" aria-hidden />}
            </button>
          </div>

          <div className="playground-toolbar-meta">
            <PlaygroundStatusBar compact />
            <Btn variant="ghost" size="sm" className="playground-toolbar-btn" onClick={handleNewSession}>
              <Icon icon={Plus} size="sm" weight="bold" />
              New Session
            </Btn>
            <Btn
              variant="icon"
              size="sm"
              className="playground-toolbar-btn-icon"
              aria-label="History"
              onClick={() => setHistoryOpen(true)}
            >
              <Icon icon={ClockCounterClockwise} size="md" />
            </Btn>
          </div>
        </div>
      </header>

      <div
        id="playground-workspace"
        className={clsx("playground-layout", mode === "execute" && "playground-layout-execute")}
        role="tabpanel"
        aria-labelledby={mode === "chat" ? "playground-tab-chat" : "playground-tab-execute"}
      >
        {mode === "chat" && (
          <PlaygroundToolPanel
            onSelectTool={session.insertTool}
            selectedTool={session.selectedTool}
          />
        )}

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
          <PlaygroundExecuteView
            selectedTool={session.selectedTool}
            onSelectTool={session.selectTool}
            scenario={session.lastScenario}
            isRunning={session.isRunning}
            traceStatus={session.traceStatus}
            traceSteps={session.traceSteps}
            onExecute={session.executeTool}
          />
        )}

        {mode === "chat" && (
          <PlaygroundTracePanel
            liveStatus={session.liveTraceStatus}
            steps={session.traceSteps}
          />
        )}
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
