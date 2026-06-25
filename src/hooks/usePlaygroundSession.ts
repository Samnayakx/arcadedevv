import { useCallback, useEffect, useRef, useState } from "react";
import type { TracePreview } from "../types";
import {
  EXECUTION_DEFAULT_USER,
  EXECUTION_PIPELINE,
  PLAYGROUND_STATUS,
  getExecutionAuth,
  matchScenario,
  scenarioForTool,
  type ExecutionAuth,
  type PlaygroundPrompt,
  type TraceScenario,
  type VisibilityStageId,
} from "../data/mockPlayground";
import {
  generateGoalReply,
  getGoalSeed,
  type GoalSuggestion,
} from "../data/playgroundContext";

export type PlaygroundTraceStatus =
  | "idle"
  | "thinking"
  | "selecting_tool"
  | "authenticating"
  | "executing"
  | "success"
  | "blocked";

export type VisibilityPhase = "idle" | "running" | "waiting_auth" | "complete";

export type VisibilityStageStatus = "pending" | "active" | "waiting" | "done";

export interface VisibilityStageState {
  id: VisibilityStageId;
  status: VisibilityStageStatus;
}

export interface PlaygroundMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  showDeployCta?: boolean;
  runId?: string;
}

export interface PlaygroundRun {
  id: string;
  prompt: string;
  toolAction: string;
  toolCalls: string[];
  reasoning: string;
  result: string;
  auth: ExecutionAuth;
  source: "onboarding" | "chat";
}

export interface StoredSession {
  id: string;
  goalId: string | null;
  label: string;
  createdAt: number;
  messages: PlaygroundMessage[];
  runs: PlaygroundRun[];
  selectedRunId: string | null;
}

const THREAD_KEY = "playground-thread";
const SESSIONS_KEY = "playground-sessions";

interface StoredThread {
  goalId: string | null;
  messages: PlaygroundMessage[];
  runs: PlaygroundRun[];
  selectedRunId: string | null;
}

function readThread(): StoredThread | null {
  try {
    const raw = sessionStorage.getItem(THREAD_KEY);
    return raw ? (JSON.parse(raw) as StoredThread) : null;
  } catch {
    return null;
  }
}

function writeThread(thread: StoredThread): void {
  try {
    sessionStorage.setItem(THREAD_KEY, JSON.stringify(thread));
  } catch {
    // Storage may be unavailable — fail open.
  }
}

function readSessions(): StoredSession[] {
  try {
    const raw = sessionStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as StoredSession[]) : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: StoredSession[]): void {
  try {
    sessionStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // Storage may be unavailable — fail open.
  }
}

function sessionLabel(messages: PlaygroundMessage[], goalId: string | null): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (firstUser) {
    return firstUser.content.length > 42
      ? `${firstUser.content.slice(0, 42)}…`
      : firstUser.content;
  }
  return getGoalSeed(goalId)?.title ?? "Playground session";
}

export function runToPreview(run: PlaygroundRun): TracePreview {
  return {
    userPrompt: run.prompt,
    agentReasoning: run.reasoning,
    toolCalls: run.toolCalls,
    result: run.result,
  };
}

interface SessionInit {
  messages: PlaygroundMessage[];
  runs: PlaygroundRun[];
  selectedRunId: string | null;
}

// A goal-seeded session opens with a contextual greeting AND a completed trace
// for the call that produced it — so the visibility panel never contradicts the
// chat on arrival from onboarding.
function seedSession(goalId: string | null): SessionInit {
  const seed = getGoalSeed(goalId);
  if (!seed) return { messages: [], runs: [], selectedRunId: null };
  const reply = generateGoalReply(goalId, "");
  const runId = nextRunId();
  const run: PlaygroundRun = {
    id: runId,
    prompt: `${seed.title} · opening briefing`,
    toolAction: reply.toolAction,
    toolCalls: reply.toolCalls,
    reasoning: reply.reasoning,
    result: reply.result,
    auth: getExecutionAuth(reply.toolAction),
    source: "onboarding",
  };
  const msg: PlaygroundMessage = {
    id: nextId(),
    role: "assistant",
    content: seed.greeting,
    runId,
  };
  return { messages: [msg], runs: [run], selectedRunId: runId };
}

function computeInitial(goalId: string | null): SessionInit {
  const stored = readThread();
  if (stored && (goalId == null || stored.goalId === goalId)) {
    const runs = stored.runs ?? [];
    return {
      messages: stored.messages,
      runs,
      selectedRunId: stored.selectedRunId ?? runs[runs.length - 1]?.id ?? null,
    };
  }
  if (goalId) return seedSession(goalId);
  const runs = stored?.runs ?? [];
  return {
    messages: stored?.messages ?? [],
    runs,
    selectedRunId: stored?.selectedRunId ?? runs[runs.length - 1]?.id ?? null,
  };
}

export interface LiveTraceStep {
  label: string;
  done: boolean;
  icon: "user" | "key" | "bolt" | "shield" | "check";
}

interface RunContext {
  text: string;
  scenario: TraceScenario;
  toolAction: string;
  auth: ExecutionAuth;
  pauseForAuth: boolean;
}

let messageId = 0;
function nextId() {
  messageId += 1;
  return `m-${Date.now().toString(36)}-${messageId}`;
}

let runCounter = 0;
function nextRunId() {
  runCounter += 1;
  return `r-${Date.now().toString(36)}-${runCounter}`;
}

function initStages(): VisibilityStageState[] {
  return EXECUTION_PIPELINE.map((stage) => ({ id: stage.id, status: "pending" as const }));
}

const AUTH_INDEX = EXECUTION_PIPELINE.findIndex((stage) => stage.id === "authorization");

function traceStatusForStage(id: VisibilityStageId): PlaygroundTraceStatus {
  switch (id) {
    case "intent":
      return "thinking";
    case "tool_selected":
      return "selecting_tool";
    case "authorization":
    case "scope_check":
      return "authenticating";
    default:
      return "executing";
  }
}

export function usePlaygroundSession(goalId: string | null = null) {
  const initRef = useRef<SessionInit | null>(null);
  if (!initRef.current) initRef.current = computeInitial(goalId);

  const [messages, setMessages] = useState<PlaygroundMessage[]>(
    () => initRef.current!.messages,
  );
  const [runs, setRuns] = useState<PlaygroundRun[]>(() => initRef.current!.runs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    () => initRef.current!.selectedRunId,
  );
  const [sessions, setSessions] = useState<StoredSession[]>(() => readSessions());
  const [message, setMessage] = useState("");

  const goalIdRef = useRef(goalId);
  goalIdRef.current = goalId;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const runsRef = useRef(runs);
  runsRef.current = runs;
  const selectedRunIdRef = useRef(selectedRunId);
  selectedRunIdRef.current = selectedRunId;

  useEffect(() => {
    writeThread({ goalId: goalIdRef.current, messages, runs, selectedRunId });
  }, [messages, runs, selectedRunId]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [traceStatus, setTraceStatus] = useState<PlaygroundTraceStatus>("idle");
  const [tracePreview, setTracePreview] = useState<TracePreview | null>(null);
  const [lastScenario, setLastScenario] = useState<TraceScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const [visStages, setVisStages] = useState<VisibilityStageState[]>(() => initStages());
  const [visPhase, setVisPhase] = useState<VisibilityPhase>("idle");
  const [visToolAction, setVisToolAction] = useState<string | null>(null);
  const [visAuth, setVisAuth] = useState<ExecutionAuth | null>(null);

  const timersRef = useRef<number[]>([]);
  const runCtxRef = useRef<RunContext | null>(null);
  const processStageRef = useRef<(index: number) => void>(() => {});

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  const setStageStatus = useCallback((index: number, status: VisibilityStageStatus) => {
    setVisStages((prev) => prev.map((stage, i) => (i === index ? { ...stage, status } : stage)));
  }, []);

  const finishRun = useCallback(() => {
    const ctx = runCtxRef.current;
    if (!ctx) return;
    setVisPhase("complete");
    setTraceStatus("success");
    setIsRunning(false);

    const runId = nextRunId();
    const run: PlaygroundRun = {
      id: runId,
      prompt: ctx.text,
      toolAction: ctx.toolAction,
      toolCalls: ctx.scenario.tracePreview.toolCalls,
      reasoning: ctx.scenario.tracePreview.agentReasoning,
      result: ctx.scenario.tracePreview.result,
      auth: ctx.auth,
      source: "chat",
    };
    setRuns((prev) => [...prev, run]);
    setSelectedRunId(runId);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        content: ctx.scenario.assistantResult,
        showDeployCta: true,
        runId,
      },
    ]);
  }, []);

  const processStage = useCallback(
    (index: number) => {
      const ctx = runCtxRef.current;
      if (!ctx) return;

      if (index >= EXECUTION_PIPELINE.length) {
        finishRun();
        return;
      }

      const stage = EXECUTION_PIPELINE[index];

      if (stage.id === "authorization" && ctx.auth.requiresAuth && ctx.pauseForAuth) {
        setStageStatus(index, "waiting");
        setVisPhase("waiting_auth");
        setTraceStatus("authenticating");
        return;
      }

      setStageStatus(index, "active");
      setTraceStatus(traceStatusForStage(stage.id));

      const timer = window.setTimeout(() => {
        setStageStatus(index, "done");
        processStageRef.current(index + 1);
      }, stage.durationMs);
      timersRef.current.push(timer);
    },
    [finishRun, setStageStatus],
  );

  processStageRef.current = processStage;

  const runPipeline = useCallback(
    (text: string, scenario: TraceScenario, toolAction: string, pauseForAuth: boolean) => {
      clearTimers();
      const auth = getExecutionAuth(toolAction);
      runCtxRef.current = { text, scenario, toolAction, auth, pauseForAuth };

      setIsRunning(true);
      setLastScenario(scenario);
      setLastPrompt(text);
      setVisToolAction(toolAction);
      setVisAuth(auth);
      setVisStages(initStages());
      setVisPhase("running");
      setTraceStatus("thinking");
      setTracePreview({ ...scenario.tracePreview, userPrompt: text });

      processStageRef.current(0);
    },
    [clearTimers],
  );

  const continueAuthorization = useCallback(() => {
    const ctx = runCtxRef.current;
    if (!ctx || visPhase !== "waiting_auth") return;

    setVisPhase("running");
    setStageStatus(AUTH_INDEX, "active");
    setTraceStatus("authenticating");

    const timer = window.setTimeout(() => {
      setStageStatus(AUTH_INDEX, "done");
      processStageRef.current(AUTH_INDEX + 1);
    }, EXECUTION_PIPELINE[AUTH_INDEX].durationMs);
    timersRef.current.push(timer);
  }, [visPhase, setStageStatus]);

  const resetSession = useCallback(() => {
    clearTimers();
    runCtxRef.current = null;
    const current = messagesRef.current;
    if (current.length) {
      const archived: StoredSession = {
        id: `s-${Date.now().toString(36)}`,
        goalId: goalIdRef.current,
        label: sessionLabel(current, goalIdRef.current),
        createdAt: Date.now(),
        messages: current,
        runs: runsRef.current,
        selectedRunId: selectedRunIdRef.current,
      };
      const next = [archived, ...readSessions()].slice(0, 20);
      writeSessions(next);
      setSessions(next);
    }
    setMessages([]);
    setRuns([]);
    setSelectedRunId(null);
    setMessage("");
    setSelectedTool(null);
    setTraceStatus("idle");
    setTracePreview(null);
    setLastScenario(null);
    setIsRunning(false);
    setLastPrompt("");
    setVisStages(initStages());
    setVisPhase("idle");
    setVisToolAction(null);
    setVisAuth(null);
  }, [clearTimers]);

  const restoreSession = useCallback(
    (id: string) => {
      const found = readSessions().find((s) => s.id === id);
      if (!found) return;
      clearTimers();
      runCtxRef.current = null;
      setMessages(found.messages);
      setRuns(found.runs ?? []);
      setSelectedRunId(found.selectedRunId ?? null);
      setMessage("");
      setTraceStatus("idle");
      setTracePreview(null);
      setIsRunning(false);
      setVisStages(initStages());
      setVisPhase("idle");
    },
    [clearTimers],
  );

  const selectRun = useCallback((id: string) => {
    setSelectedRunId(id);
  }, []);

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? message).trim();
      if (!content || isRunning) return;

      setMessages((prev) => [...prev, { id: nextId(), role: "user", content }]);
      setMessage("");

      const reply = generateGoalReply(goalIdRef.current, content);
      const base = matchScenario(content);
      const scenario: TraceScenario = {
        ...base,
        toolAction: reply.toolAction,
        assistantResult: reply.content,
        tracePreview: {
          userPrompt: content,
          agentReasoning: reply.reasoning,
          toolCalls: reply.toolCalls,
          result: reply.result,
        },
      };
      runPipeline(content, scenario, reply.toolAction, true);
    },
    [message, isRunning, runPipeline],
  );

  const handlePromptClick = useCallback((prompt: PlaygroundPrompt) => {
    const text = `${prompt.title} ${prompt.subtitle}`;
    setMessage(text);
  }, []);

  const runAgain = useCallback(() => {
    if (!lastPrompt || !lastScenario || isRunning) return;
    setMessages((prev) => prev.filter((m) => !m.showDeployCta));
    runPipeline(lastPrompt, lastScenario, lastScenario.toolAction, true);
  }, [lastPrompt, lastScenario, isRunning, runPipeline]);

  const insertTool = useCallback((action: string) => {
    setSelectedTool(action);
    setMessage((prev) => {
      const prefix = `Using ${action}: `;
      if (prev.startsWith(prefix)) return prev;
      return prev ? `${prev}\n${prefix}` : prefix;
    });
  }, []);

  const selectTool = useCallback((action: string) => {
    setSelectedTool(action);
  }, []);

  const executeTool = useCallback(
    (toolAction: string) => {
      if (isRunning) return;
      const scenario = scenarioForTool(toolAction);
      runPipeline(`Execute ${toolAction}`, scenario, toolAction, false);
    },
    [isRunning, runPipeline],
  );

  const traceSteps: LiveTraceStep[] = visStages
    .filter((stage) => stage.status !== "pending")
    .map((stage, index) => {
      const def = EXECUTION_PIPELINE[index];
      return {
        label: stage.status === "done" ? def.doneLabel : def.runningLabel,
        done: stage.status === "done",
        icon: def.icon,
      };
    });

  const liveTraceStatus: "waiting" | "active" | "complete" =
    visPhase === "idle" ? "waiting" : visPhase === "complete" ? "complete" : "active";

  const seed = getGoalSeed(goalId);
  const seedSuggestions: GoalSuggestion[] = seed?.suggestions ?? [];
  const goalTitle = seed?.title ?? null;

  // While a run is live, show its in-flight trace; otherwise show whichever
  // completed run is selected (defaults to the latest / seeded one).
  const isLive = visPhase === "running" || visPhase === "waiting_auth";
  const selectedRun = runs.find((r) => r.id === selectedRunId) ?? null;
  const displayTrace: TracePreview | null = isLive
    ? tracePreview
    : selectedRun
      ? runToPreview(selectedRun)
      : null;

  const actingUser = selectedRun?.auth.user ?? visAuth?.user ?? EXECUTION_DEFAULT_USER;
  const environment = PLAYGROUND_STATUS.environment;

  return {
    messages,
    runs,
    selectedRunId,
    selectRun,
    actingUser,
    environment,
    sessions,
    restoreSession,
    seedSuggestions,
    goalTitle,
    message,
    setMessage,
    selectedTool,
    traceStatus,
    traceSteps,
    tracePreview: displayTrace,
    lastScenario,
    isRunning,
    lastPrompt,
    liveTraceStatus,
    visStages,
    visPhase,
    visToolAction,
    visAuth,
    continueAuthorization,
    sendMessage,
    handlePromptClick,
    resetSession,
    runAgain,
    insertTool,
    selectTool,
    executeTool,
  };
}
