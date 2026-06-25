import { motion } from "framer-motion";
import {
  ArrowsClockwise,
  ChartLineUp,
  Hourglass,
  Key,
} from "@phosphor-icons/react";
import type { ProjectHealth, TabId } from "../../types";

type MetricKey = keyof Pick<
  ProjectHealth,
  | "toolCallSuccessRate"
  | "authCompletionRate"
  | "approvalBottleneckRate"
  | "recoveryRateAfterFailure"
>;

const cards: {
  key: MetricKey;
  label: string;
  tab: TabId;
  icon: typeof ChartLineUp;
}[] = [
  {
    key: "toolCallSuccessRate",
    label: "Tool call success",
    tab: "tool-calls",
    icon: ChartLineUp,
  },
  {
    key: "recoveryRateAfterFailure",
    label: "Recovery after failure",
    tab: "runs",
    icon: ArrowsClockwise,
  },
  {
    key: "authCompletionRate",
    label: "Auth completion rate",
    tab: "auth",
    icon: Key,
  },
  {
    key: "approvalBottleneckRate",
    label: "Approval bottleneck",
    tab: "policies",
    icon: Hourglass,
  },
];

const analyticsGroups: {
  title: string;
  keys: readonly MetricKey[];
}[] = [
  {
    title: "Agent reliability",
    keys: ["toolCallSuccessRate", "recoveryRateAfterFailure"],
  },
  { title: "Authorization health", keys: ["authCompletionRate"] },
  { title: "User completion", keys: ["approvalBottleneckRate"] },
];

function Sparkline({ seed }: { seed: number }) {
  const points = [
    22 + (seed % 5),
    18 + (seed % 7),
    20 + (seed % 4),
    12 + (seed % 6),
    16 + (seed % 3),
    10 + (seed % 5),
  ];
  const line = points.map((y, i) => `${(i / (points.length - 1)) * 80},${y}`).join(" L ");
  const area = `M0,32 L ${line} L 80,32 Z`;

  return (
    <svg className="analytics-sparkline" viewBox="0 0 80 32" preserveAspectRatio="none" aria-hidden>
      <path d={area} className="analytics-sparkline-fill" />
      <path d={`M ${line}`} className="analytics-sparkline-line" fill="none" />
    </svg>
  );
}

function formatMetricValue(raw: ProjectHealth[MetricKey], isEmpty: boolean) {
  if (isEmpty && raw === 0) return "—";
  return `${raw}%`;
}

export function HealthHighlightCards({
  health,
  onSelectTab,
  isEmpty,
}: {
  health: ProjectHealth;
  onSelectTab: (tab: TabId) => void;
  isEmpty?: boolean;
}) {
  const cardMap = Object.fromEntries(cards.map((c) => [c.key, c]));

  return (
    <div className="analytics-cards">
      {analyticsGroups.map((group, groupIndex) => (
        <div key={group.title} className="analytics-card dashboard-card">
          <div className="dashboard-card-head">
            <h3>{group.title}</h3>
          </div>
          <div className="analytics-metrics">
            {group.keys.map((key, metricIndex) => {
              const card = cardMap[key];
              const Icon = card.icon;
              const raw = health[key];
              const value = formatMetricValue(raw, !!isEmpty);
              const seed = groupIndex * 10 + metricIndex;

              return (
                <motion.button
                  key={key}
                  type="button"
                  className="analytics-metric"
                  onClick={() => !isEmpty && onSelectTab(card.tab)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: seed * 0.03 }}
                  whileHover={isEmpty ? undefined : { backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div className="analytics-metric-top">
                    <div className="analytics-metric-label-row">
                      <Icon size={14} color="var(--text-faint)" />
                      <span className="analytics-metric-label">{card.label}</span>
                    </div>
                    <span className="analytics-metric-value">{value}</span>
                  </div>
                  <Sparkline seed={seed} />
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
