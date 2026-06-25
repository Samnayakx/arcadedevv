import {
  ClockCounterClockwise,
  Plus,
  TerminalWindow,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { usePlaygroundSession } from "../hooks/usePlaygroundSession";
import { PlaygroundChat } from "../components/playground/PlaygroundChat";
import { PlaygroundExecuteView } from "../components/playground/PlaygroundExecuteView";
import { PlaygroundHistoryDrawer } from "../components/playground/PlaygroundHistoryDrawer";
import { PlaygroundToolPanel } from "../components/playground/PlaygroundToolPanel";
import { PlaygroundVisibilityPanel } from "../components/playground/PlaygroundVisibilityPanel";
import { Btn } from "../components/primitives/Btn";
import { Icon } from "../components/primitives/Icon";

export function Playground() {
  const [mode, setMode] = useState<"chat" | "execute">("chat");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const { onboardingGoal } = useApp();
  const session = usePlaygroundSession(onboardingGoal);

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
              className={clsx("playground-mode-tab", mode === "chat" && "active")}
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
              className={clsx("playground-mode-tab", mode === "execute" && "active")}
              onClick={() => setMode("execute")}
            >
              <Icon icon={TerminalWindow} size="sm" aria-hidden />
              Execute
            </button>
          </div>

          <div className="playground-toolbar-meta">
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
        className={clsx(
          "playground-layout",
          mode === "execute" && "playground-layout-execute",
          mode === "chat" && !toolsOpen && "playground-layout-no-tools",
        )}
        role="tabpanel"
        aria-labelledby={mode === "chat" ? "playground-tab-chat" : "playground-tab-execute"}
      >
        {mode === "chat" && toolsOpen && (
          <PlaygroundToolPanel
            onSelectTool={session.insertTool}
            selectedTool={session.selectedTool}
            onClose={() => setToolsOpen(false)}
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
            seedSuggestions={session.seedSuggestions}
            toolsOpen={toolsOpen}
            onToggleTools={() => setToolsOpen((v) => !v)}
            onInsertTool={session.insertTool}
            runs={session.runs}
            selectedRunId={session.selectedRunId}
            onSelectRun={session.selectRun}
            onSend={() => session.sendMessage()}
            onSendPrompt={(text) => session.sendMessage(text)}
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
          <PlaygroundVisibilityPanel
            phase={session.visPhase}
            liveStages={session.visStages}
            liveToolAction={session.visToolAction}
            liveAuth={session.visAuth}
            onContinueAuth={session.continueAuthorization}
            runs={session.runs}
            selectedRunId={session.selectedRunId}
            onSelectRun={session.selectRun}
            goalTitle={session.goalTitle}
            actingUser={session.actingUser}
            environment={session.environment}
          />
        )}
      </div>

      <PlaygroundHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={session.sessions}
        onRestore={(id) => {
          session.restoreSession(id);
          setMode("chat");
        }}
      />
    </div>
  );
}
