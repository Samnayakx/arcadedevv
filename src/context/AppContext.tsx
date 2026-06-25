import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProjectMaturity, Screen, SetupState, SetupStepKey, TabId } from "../types";

const INITIAL_SETUP_STATE: SetupState = {
  framework_selected: false,
  sdk_copied: false,
  api_key_copied: false,
  tool_action_selected: false,
  auth_completed: false,
  code_copied: false,
  first_run_received: false,
  trace_created: false,
};

interface AppContextValue {
  screen: Screen;
  maturity: ProjectMaturity;
  activeTab: TabId;
  flowFilter: string;
  selectedRunId: string | null;
  selectedAgentId: string | null;
  traceOpen: boolean;
  organizationName: string;
  projectName: string;
  playgroundPrompt: string | null;
  onboardingGoal: string | null;
  setupState: SetupState;
  setScreen: (screen: Screen) => void;
  setMaturity: (m: ProjectMaturity) => void;
  setActiveTab: (tab: TabId) => void;
  setFlowFilter: (id: string) => void;
  setOrganizationName: (name: string) => void;
  setProjectName: (name: string) => void;
  setPlaygroundPrompt: (prompt: string | null) => void;
  setOnboardingGoal: (goalId: string | null) => void;
  markSetupStep: (key: SetupStepKey) => void;
  resetSetupState: () => void;
  completeWorkspaceSetup: () => void;
  openTrace: (runId: string) => void;
  closeTrace: () => void;
  openAgent: (agentId: string) => void;
  closeAgent: () => void;
  finishFlow: () => void;
  exploreDashboard: () => void;
  deployFromPlayground: (prompt: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("workspace");
  const [maturity, setMaturityState] = useState<ProjectMaturity>("empty");
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [flowFilter, setFlowFilter] = useState("all");
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [traceOpen, setTraceOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("sambit's org");
  const [projectName, setProjectName] = useState("Default project");
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string | null>(null);
  const [onboardingGoal, setOnboardingGoal] = useState<string | null>(null);
  const [setupState, setSetupState] = useState<SetupState>(INITIAL_SETUP_STATE);

  const markSetupStep = useCallback((key: SetupStepKey) => {
    setSetupState((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  const resetSetupState = useCallback(() => {
    setSetupState(INITIAL_SETUP_STATE);
  }, []);

  const completeWorkspaceSetup = useCallback(() => {
    setScreen("get-started");
  }, []);

  const setMaturity = useCallback((next: ProjectMaturity) => {
    setMaturityState(next);
    setScreen(next === "empty" ? "empty" : "active");
    setActiveTab("dashboard");
    setTraceOpen(false);
    setFlowFilter("all");
  }, []);

  const finishFlow = useCallback(() => {
    setMaturityState("active");
    setScreen("playground");
  }, []);

  const deployFromPlayground = useCallback((prompt: string) => {
    setPlaygroundPrompt(prompt);
    setScreen("build");
  }, []);

  const exploreDashboard = useCallback(() => {
    setMaturityState("empty");
    setScreen("empty");
    setActiveTab("dashboard");
  }, []);

  const openTrace = useCallback((runId: string) => {
    setSelectedRunId(runId);
    setTraceOpen(true);
  }, []);

  const closeTrace = useCallback(() => {
    setTraceOpen(false);
  }, []);

  const openAgent = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    setFlowFilter(agentId);
    setScreen("agent-detail");
  }, []);

  const closeAgent = useCallback(() => {
    setSelectedAgentId(null);
    setScreen("active");
    setActiveTab("flows");
  }, []);

  const value = useMemo(
    () => ({
      screen,
      maturity,
      activeTab,
      flowFilter,
      selectedRunId,
      selectedAgentId,
      traceOpen,
      organizationName,
      projectName,
      playgroundPrompt,
      onboardingGoal,
      setupState,
      setScreen,
      setMaturity,
      setActiveTab,
      setFlowFilter,
      setOrganizationName,
      setProjectName,
      setPlaygroundPrompt,
      setOnboardingGoal,
      markSetupStep,
      resetSetupState,
      completeWorkspaceSetup,
      openTrace,
      closeTrace,
      openAgent,
      closeAgent,
      finishFlow,
      exploreDashboard,
      deployFromPlayground,
    }),
    [
      screen,
      maturity,
      activeTab,
      flowFilter,
      selectedRunId,
      selectedAgentId,
      traceOpen,
      organizationName,
      projectName,
      playgroundPrompt,
      onboardingGoal,
      setupState,
      markSetupStep,
      resetSetupState,
      completeWorkspaceSetup,
      finishFlow,
      exploreDashboard,
      deployFromPlayground,
      setMaturity,
      openTrace,
      closeTrace,
      openAgent,
      closeAgent,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
