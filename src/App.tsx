import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useEffect } from "react";
import { LeftNav, TopBar } from "./components/chrome/AppChrome";
import { AppFooter } from "./components/chrome/AppFooter";
import { useApp } from "./context/AppContext";
import { useSidebar } from "./hooks/useSidebar";
import { BuildAgentFlow } from "./pages/BuildAgentFlow";
import { GatewayFlow } from "./pages/GatewayFlow";
import { GetStarted } from "./pages/GetStarted";
import { ProjectHome } from "./pages/ProjectHome";
import { Playground } from "./pages/Playground";
import { ToolCatalog } from "./pages/ToolCatalog";
import { SandboxFlow } from "./pages/SandboxFlow";
import { AgentDetail } from "./pages/AgentDetail";
import { fadeIn } from "./app/motion";

const ONBOARDING_SCREENS = new Set([
  "get-started",
  "build",
  "gateway",
  "sandbox",
]);
const DASHBOARD_SCREENS = new Set(["empty", "active", "playground", "agent-detail", "tool-catalog"]);

function MainContent() {
  const { screen, setScreen } = useApp();
  const sidebar = useSidebar();
  const isOnboarding = ONBOARDING_SCREENS.has(screen);
  const isDashboard = DASHBOARD_SCREENS.has(screen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "g") {
        event.preventDefault();
        setScreen("get-started");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setScreen]);

  if (isOnboarding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={screen} className="onboarding-root" {...fadeIn}>
          {screen === "get-started" && <GetStarted />}
          {screen === "build" && <BuildAgentFlow />}
          {screen === "gateway" && <GatewayFlow />}
          {screen === "sandbox" && <SandboxFlow />}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      className={clsx(
        "app-layout",
        sidebar.open && "sidebar-open",
        sidebar.collapsed && "sidebar-collapsed",
        sidebar.isCompact && "sidebar-compact",
        sidebar.isOverlay && "sidebar-overlay",
        sidebar.isResizing && "sidebar-resizing",
      )}
      style={{ "--nav-width": `${sidebar.width}px` } as React.CSSProperties}
    >
      {sidebar.isOverlay && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={sidebar.close}
        />
      )}

      {isDashboard && (
        <LeftNav
          onNavigate={sidebar.close}
          onResizeStart={sidebar.startResize}
          canResize={sidebar.canResize}
        />
      )}

      <div className="app-main">
        {isDashboard && (
          <TopBar
            onToggleSidebar={sidebar.toggle}
            sidebarOpen={sidebar.open}
            sidebarCollapsed={sidebar.collapsed}
            sidebarViewport={sidebar.viewport}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.main key={screen} className="app-content" {...fadeIn}>
            {(screen === "empty" || screen === "active") && <ProjectHome />}
            {screen === "agent-detail" && <AgentDetail />}
            {screen === "playground" && <Playground />}
            {screen === "tool-catalog" && <ToolCatalog />}
          </motion.main>
        </AnimatePresence>
        {isDashboard && <AppFooter />}
      </div>
    </div>
  );
}

export default function App() {
  return <MainContent />;
}
