import { motion } from "framer-motion";
import type { ProjectHealth, TabId } from "../../types";
import { KpiMiniViz } from "./KpiMiniViz";

const KPI_ITEMS = [
  { key: "activeFlows" as const, viz: "activeAgents" as const, label: "Active Agents" },
  { key: "toolCallSuccessRate" as const, viz: "successRate" as const, label: "Success Rate", suffix: "%" },
  { key: "blockedUsers" as const, viz: "blockedUsers" as const, label: "Blocked Users" },
  { key: "criticalFailures" as const, viz: "criticalFailures" as const, label: "Critical Failures" },
];

export function ControlCenterKpis({
  health,
  onSelectTab,
}: {
  health: ProjectHealth;
  onSelectTab: (tab: TabId) => void;
}) {
  return (
    <div className="control-center-kpi-strip">
      {KPI_ITEMS.map((item, index) => {
        const raw = health[item.key];
        const value = item.suffix === "%" ? `${raw}%` : String(raw);

        return (
          <motion.button
            key={item.key}
            type="button"
            className="control-center-kpi"
            onClick={() => onSelectTab(item.key === "activeFlows" ? "flows" : "runs")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <span className="control-center-kpi-label">{item.label}</span>
            <div className="control-center-kpi-main">
              <span className="control-center-kpi-value">{value}</span>
              <KpiMiniViz kind={item.viz} value={raw} />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
