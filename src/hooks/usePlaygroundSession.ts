import { useCallback, useRef, useState } from "react";
import type { TracePreview } from "../types";
import {
  matchScenario,
  type PlaygroundPrompt,
  type TraceScenario,
} from "../data/mockPlayground";

export type PlaygroundTraceStatus =
  | "idle"
  | "thinking"
  | "selecting_tool"
  | "authenticating"
  | "executing"
  | "success"
  | "blocked";

export interface PlaygroundMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  showDeployCta?: boolean;
}

export interface LiveTraceStep {
  label: string;
  done: boolean;
  icon: "user" | "key" | "bolt" | "shield" | "check";
}

let messageId = 0;
function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

export function usePlaygroundSession() {
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [traceStatus, setTraceStatus] = useState<PlaygroundTraceStatus>("idle");
  const [traceSteps, setTraceSteps] = useState<LiveTraceStep[]>([]);
  const [tracePreview, setTracePreview] = useState<TracePreview | null>(null);
  const [lastScenario, setLastScenario] = useState<TraceScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const resetSession = useCallback(() => {
    clearTimers();
    setMessages([]);
    setMessage("");
    setSelectedTool(null);
    setTraceStatus("idle");
    setTraceSteps([]);
    setTracePreview(null);
    setLastScenario(null);
    setIsRunning(false);
    setLastPrompt("");
  }, [clearTimers]);

  const runTrace = useCallback(
    (text: string, scenario: TraceScenario) => {
      clearTimers();
      setIsRunning(true);
      setTraceStatus("thinking");
      setTraceSteps([]);
      setTracePreview(null);
      setLastScenario(scenario);
      setLastPrompt(text);

      const preview: TracePreview = {
        ...scenario.tracePreview,
        userPrompt: text,
      };
      setTracePreview(preview);

      let accumulated: LiveTraceStep[] = [];

      scenario.steps.forEach((step, index) => {
        const delay = scenario.steps
          .slice(0, index + 1)
          .reduce((sum, s) => sum + s.delayMs, 0);

        const timer = window.setTimeout(() => {
          accumulated = [
            ...accumulated.map((s) => ({ ...s, done: true })),
            { label: step.label, done: false, icon: step.icon },
          ];
          setTraceSteps([...accumulated]);

          if (index === 0) setTraceStatus("thinking");
          else if (step.label.includes("Selecting")) setTraceStatus("selecting_tool");
          else if (step.label.includes("Authenticat")) setTraceStatus("authenticating");
          else if (step.label.includes("Executing") || step.label.includes("Policy")) {
            setTraceStatus("executing");
          }

          if (index === scenario.steps.length - 1) {
            const doneSteps = accumulated.map((s) => ({ ...s, done: true }));
            setTraceSteps(doneSteps);
            setTraceStatus("success");
            setIsRunning(false);
            setMessages((prev) => [
              ...prev,
              {
                id: nextId(),
                role: "assistant",
                content: scenario.assistantResult,
                showDeployCta: true,
              },
            ]);
          }
        }, delay);

        timersRef.current.push(timer);
      });
    },
    [clearTimers],
  );

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? message).trim();
      if (!content || isRunning) return;

      setMessages((prev) => [...prev, { id: nextId(), role: "user", content }]);
      setMessage("");
      const scenario = matchScenario(content);
      runTrace(content, scenario);
    },
    [message, isRunning, runTrace],
  );

  const handlePromptClick = useCallback((prompt: PlaygroundPrompt) => {
    const text = `${prompt.title} ${prompt.subtitle}`;
    setMessage(text);
  }, []);

  const runAgain = useCallback(() => {
    if (!lastPrompt || !lastScenario) return;
    setMessages((prev) => prev.filter((m) => !m.showDeployCta));
    runTrace(lastPrompt, lastScenario);
  }, [lastPrompt, lastScenario, runTrace]);

  const insertTool = useCallback((action: string) => {
    setSelectedTool(action);
    setMessage((prev) => {
      const prefix = `Using ${action}: `;
      if (prev.startsWith(prefix)) return prev;
      return prev ? `${prev}\n${prefix}` : prefix;
    });
  }, []);

  const liveTraceStatus: "waiting" | "active" | "complete" =
    traceStatus === "idle"
      ? "waiting"
      : traceStatus === "success"
        ? "complete"
        : "active";

  return {
    messages,
    message,
    setMessage,
    selectedTool,
    traceStatus,
    traceSteps,
    tracePreview,
    lastScenario,
    isRunning,
    lastPrompt,
    liveTraceStatus,
    sendMessage,
    handlePromptClick,
    resetSession,
    runAgain,
    insertTool,
  };
}
