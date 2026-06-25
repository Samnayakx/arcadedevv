import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { getMockProject } from "../data/mockProject";
import { AgentFlowMap } from "../components/home/AgentFlowMap";
import { ControlCenterKpis } from "../components/home/ControlCenterKpis";
import {
  ControlCenterEmptyHero,
  FirstRunMilestone,
  FirstRunResultCard,
  SetupProgressChecklist,
} from "../components/home/ControlCenterStates";
import { NeedsAttentionTable } from "../components/home/NeedsAttentionTable";
import { OperationalTabs } from "../components/home/OperationalTabs";
import { ProjectSummaryPanel } from "../components/home/ProjectSummaryPanel";
import { RecentRunsPanel } from "../components/home/RecentRunsPanel";
import { SetupCtaBanner } from "../components/home/SetupCtaBanner";
import { TraceDrawer } from "../components/home/TraceDrawer";
import type { ProjectMaturity } from "../types";

const MATURITY_OPTIONS: { id: ProjectMaturity; label: string }[] = [
  { id: "empty", label: "Empty" },
  { id: "flow_no_auth", label: "Needs auth" },
  { id: "first_run", label: "First run" },
  { id: "active", label: "Active" },
];

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
    return "GitHub access is blocking 1 agent flow.";
  }
  if (maturity === "first_run") {
    return "Your agent ran successfully. Enable test users to go live.";
  }
  if (attentionCount > 0) {
    return `${attentionCount} issues need attention across ${activeAgents} active agents.`;
  }
  return `Operations overview for ${projectName}.`;
}

export function ProjectHome() {
  const {
    maturity,
    setMaturity,
    flowFilter,
    setFlowFilter,
    setActiveTab,
    activeTab,
    screen,
    openTrace,
    openAgent,
  } = useApp();

  const isEmpty = maturity === "empty" || screen === "empty";
  const isPreRun = maturity === "flow_no_auth";
  const isFirstRun = maturity === "first_run";
  const isSetupPhase = isPreRun || isFirstRun;
  const isActive = maturity === "active" && !isEmpty;

  const project = getMockProject(maturity);
  const latestRun = project.runs[0];
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
            <span className="project-home-breadcrumb">Control Center</span>
            <h1>Control Center</h1>
          </div>
          <div className="maturity-switcher">
            <span className="field-label">Demo state</span>
            <select
              value={maturity}
              onChange={(e) => setMaturity(e.target.value as ProjectMaturity)}
            >
              {MATURITY_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </header>
        <ControlCenterEmptyHero />
        <TraceDrawer />
      </div>
    );
  }

  return (
    <div className="project-home">
      <header className="project-home-header">
        <div className="project-home-header-main">
          <span className="project-home-breadcrumb">Control Center</span>
          <h1>Control Center</h1>
          <p>
            {headerCopy(
              maturity,
              project.projectName,
              project.attention.length,
              project.health.activeFlows,
            )}
          </p>
        </div>
        <div className="maturity-switcher">
          <span className="field-label">Demo state</span>
          <select
            value={maturity}
            onChange={(e) => setMaturity(e.target.value as ProjectMaturity)}
          >
            {MATURITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </header>

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
            <AgentFlowMap
              flows={project.flows}
              selectedFlowId={flowFilter}
              onSelectFlow={setFlowFilter}
              isEmpty={isEmpty}
              expanded
            />
            <div className="dashboard-stack">
              {latestRun && (
                <FirstRunResultCard run={latestRun} onOpenRun={openTrace} />
              )}
              <SetupCtaBanner
                firstRun
                variant="card"
                onViewTrace={() => latestRun && openTrace(latestRun.id)}
              />
            </div>
          </div>
        ) : (
          <div
            className={`dashboard-grid ${
              isPreRun ? "dashboard-grid-3" : "dashboard-grid-summary-flow"
            }`}
          >
            <ProjectSummaryPanel health={project.health} isEmpty={isEmpty} />
            {isActive && (
              <AgentFlowMap
                flows={project.flows}
                selectedFlowId={flowFilter}
                onSelectFlow={setFlowFilter}
                isEmpty={isEmpty}
                expanded
              />
            )}
            {isPreRun && (
              <SetupCtaBanner compact variant="card" />
            )}
          </div>
        )}
      </section>

      {(isActive || (isSetupPhase && project.attention.length > 0)) && (
        <section className="dashboard-section">
          <div className="dashboard-card dashboard-card-fill">
            <NeedsAttentionTable
              items={project.attention}
              onOpenAgent={openAgent}
            />
          </div>
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
