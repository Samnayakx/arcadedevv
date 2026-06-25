import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { getMockProject } from "../data/mockProject";
import { AgentCardsPanel } from "../components/home/AgentCardsPanel";
import { AgentSetupBanner } from "../components/home/AgentSetupBanner";
import { ControlCenterKpis } from "../components/home/ControlCenterKpis";
import {
  ControlCenterEmptyHero,
  FirstRunMilestone,
  SetupProgressChecklist,
} from "../components/home/ControlCenterStates";
import { ExecutionTraceMap } from "../components/home/ExecutionTraceMap";
import { NeedsAttentionCards } from "../components/home/NeedsAttentionCards";
import { OperationalTabs } from "../components/home/OperationalTabs";
import { ProjectSummaryPanel } from "../components/home/ProjectSummaryPanel";
import { RecentRunsPanel } from "../components/home/RecentRunsPanel";
import { SetupCtaBanner } from "../components/home/SetupCtaBanner";
import { TraceDrawer } from "../components/home/TraceDrawer";
import { MaturitySwitcher } from "../components/home/MaturitySwitcher";
import type { ProjectMaturity } from "../types";

function headerCopy(
  maturity: ProjectMaturity,
  projectName: string,
  attentionCount: number,
  activeAgents: number,
) {
  if (maturity === "empty") {
    return "Your project is ready. Connect a tool and run your first agent action.";
  }
  if (maturity === "flow_no_auth") {
    return "Your agent flow is ready. Authorize GitHub to run the first action.";
  }
  if (maturity === "first_run") {
    return "Your first trace succeeded. Enable test users to go live.";
  }
  if (attentionCount > 0) {
    return `${attentionCount} issues need attention across ${activeAgents} active agents.`;
  }
  return `Operations overview for ${projectName}.`;
}

export function ProjectHome() {
  const {
    maturity,
    setActiveTab,
    activeTab,
    openTrace,
    openAgent,
    setupState,
  } = useApp();

  const isEmpty = maturity === "empty";
  const isPreRun = maturity === "flow_no_auth";
  const isFirstRun = maturity === "first_run";
  const isSetupPhase = isPreRun || isFirstRun;
  const isActive = maturity === "active";

  const waitingForFirstRun =
    setupState.api_key_copied && !setupState.first_run_received;
  const showSetupBanner = waitingForFirstRun && (isEmpty || isPreRun);

  const project = getMockProject(maturity);
  const traceRuns = project.runs.filter((run) => run.tracePreview);
  const operationsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeTab !== "dashboard" && operationsRef.current) {
      operationsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeTab]);

  if (isEmpty) {
    return (
      <div className="project-home project-home-empty">
        <header className="project-home-header project-home-header-compact">
          <div className="project-home-header-main">
            <span className="project-home-breadcrumb">Dashboard</span>
            <h1>Dashboard</h1>
          </div>
          <MaturitySwitcher />
        </header>
        {showSetupBanner && (
          <section className="dashboard-section">
            <AgentSetupBanner />
          </section>
        )}
        <ControlCenterEmptyHero />
        <TraceDrawer />
      </div>
    );
  }

  return (
    <div className="project-home">
      <header className="project-home-header">
        <div className="project-home-header-main">
          <span className="project-home-breadcrumb">Dashboard</span>
          <h1>Dashboard</h1>
          <p>
            {headerCopy(
              maturity,
              project.projectName,
              project.attention.length,
              project.health.activeFlows,
            )}
          </p>
        </div>
        <MaturitySwitcher />
      </header>

      {showSetupBanner && (
        <section className="dashboard-section">
          <AgentSetupBanner />
        </section>
      )}

      {isPreRun && (
        <section className="dashboard-section">
          <SetupProgressChecklist maturity={maturity} />
        </section>
      )}

      {isFirstRun && (
        <section className="dashboard-section">
          <FirstRunMilestone />
        </section>
      )}

      {isActive && (
        <motion.section
          className="dashboard-section dashboard-analytics"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ControlCenterKpis health={project.health} onSelectTab={setActiveTab} />
        </motion.section>
      )}

      <section className="dashboard-section">
        {isFirstRun ? (
          <div className="dashboard-grid dashboard-grid-first-run">
            {traceRuns.length > 0 && (
              <ExecutionTraceMap
                runs={project.runs}
                onOpenTrace={openTrace}
                expanded
              />
            )}
            <div className="dashboard-stack">
              <SetupCtaBanner
                firstRun
                variant="card"
                onViewTrace={() => traceRuns[0] && openTrace(traceRuns[0].id)}
              />
            </div>
          </div>
        ) : (
          <div
            className={`dashboard-grid ${
              isPreRun ? "dashboard-grid-3" : "dashboard-grid-summary-flow"
            }`}
          >
            <ProjectSummaryPanel
              health={project.health}
              isEmpty={isEmpty}
              onSelectTab={setActiveTab}
            />
            {traceRuns.length > 0 && isActive && (
              <ExecutionTraceMap
                runs={project.runs}
                onOpenTrace={openTrace}
                expanded
              />
            )}
            {isPreRun && (
              <SetupCtaBanner compact variant="card" />
            )}
          </div>
        )}
      </section>

      {project.flows.length > 0 && (
        <section className="dashboard-section">
          <AgentCardsPanel flows={project.flows} onOpenAgent={openAgent} />
        </section>
      )}

      {(isActive || (isSetupPhase && project.attention.length > 0)) && (
        <section className="dashboard-section">
          <NeedsAttentionCards
            items={project.attention}
            onOpenAgent={openAgent}
          />
        </section>
      )}

      {isActive && (
        <section className="dashboard-section">
          <RecentRunsPanel
            runs={project.runs}
            onOpenRun={openTrace}
            onOpenAgent={openAgent}
          />
        </section>
      )}

      {isActive && (
        <section ref={operationsRef} className="dashboard-section dashboard-operations">
          <OperationalTabs project={project} isEmpty={isEmpty} />
        </section>
      )}

      <TraceDrawer />
    </div>
  );
}
