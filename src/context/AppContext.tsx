import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProjectMaturity, Screen, TabId } from "../types";

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
  setScreen: (screen: Screen) => void;
  setMaturity: (m: ProjectMaturity) => void;
  setActiveTab: (tab: TabId) => void;
  setFlowFilter: (id: string) => void;
  setOrganizationName: (name: string) => void;
  setProjectName: (name: string) => void;
  setPlaygroundPrompt: (prompt: string | null) => void;
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
  const [screen, setScreen] = useState<Screen>("get-started");
  const [maturity, setMaturity] = useState<ProjectMaturity>("empty");
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [flowFilter, setFlowFilter] = useState("all");
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [traceOpen, setTraceOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("sambit's org");
  const [projectName, setProjectName] = useState("Default project");
  const [playgroundPrompt, setPlaygroundPrompt] = useState<string | null>(null);

  const finishFlow = useCallback(() => {
    setMaturity("active");
    setScreen("playground");
  }, []);

  const deployFromPlayground = useCallback((prompt: string) => {
    setPlaygroundPrompt(prompt);
    setScreen("build");
  }, []);

  const exploreDashboard = useCallback(() => {
    setMaturity("empty");
    setScreen("empty");
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
      setScreen,
      setMaturity,
      setActiveTab,
      setFlowFilter,
      setOrganizationName,
      setProjectName,
      setPlaygroundPrompt,
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
      finishFlow,
      exploreDashboard,
      deployFromPlayground,
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
