import clsx from "clsx";
import { useMemo, useState } from "react";

type VizTone = "violet" | "accent" | "warning" | "danger";

function deriveTrend(seed: number, points: number, end: number) {
  const start = Math.max(1, Math.round(end * 0.55));
  return Array.from({ length: points }, (_, index) => {
    const progress = index / Math.max(points - 1, 1);
    const wave = Math.sin((index + seed) * 1.4) * 0.08;
    return Math.max(1, Math.round(start + (end - start) * progress + end * wave));
  });
}

function MiniBars({
  values,
  tone,
  highlightLast,
  activeIndex,
  onHoverIndex,
}: {
  values: number[];
  tone: VizTone;
  highlightLast?: boolean;
  activeIndex: number | null;
  onHoverIndex: (index: number | null) => void;
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="kpi-viz kpi-viz-bars" onMouseLeave={() => onHoverIndex(null)}>
      {values.map((value, index) => {
        const highlighted =
          activeIndex === index || (highlightLast && index === values.length - 1);
        return (
          <span
            key={index}
            className={clsx(
              "kpi-viz-bar",
              `kpi-viz-bar-${tone}`,
              highlighted && "kpi-viz-bar-active",
            )}
            style={{ height: `${(value / max) * 100}%` }}
            onMouseEnter={() => onHoverIndex(index)}
          />
        );
      })}
    </div>
  );
}

function MiniSegment({
  value,
  tone,
}: {
  value: number;
  tone: VizTone;
}) {
  return (
    <div className="kpi-viz kpi-viz-segment">
      <span
        className={clsx("kpi-viz-segment-fill", `kpi-viz-segment-${tone}`)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function MiniSparkline({
  values,
  tone,
}: {
  values: number[];
  tone: VizTone;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const width = 72;
  const height = 24;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className={clsx("kpi-viz kpi-viz-sparkline", `kpi-viz-sparkline-${tone}`)} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline points={points} fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KpiMiniViz({
  kind,
  value,
}: {
  kind: "activeAgents" | "successRate" | "blockedUsers" | "criticalFailures";
  value: number;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const config = useMemo(() => {
    switch (kind) {
      case "activeAgents":
        return {
          tone: "violet" as const,
          bars: deriveTrend(2, 8, value),
          hint: "Agent count over the last 8 hours",
        };
      case "successRate":
        return {
          tone: "accent" as const,
          bars: deriveTrend(5, 10, value),
          hint: "Successful tool calls vs total volume",
        };
      case "blockedUsers":
        return {
          tone: "warning" as const,
          bars: deriveTrend(7, 8, value),
          hint: "Users waiting on auth or approval",
        };
      case "criticalFailures":
        return {
          tone: "danger" as const,
          bars: deriveTrend(11, 10, value),
          hint: "High-severity failures in the last day",
        };
    }
  }, [kind, value]);

  const activeValue =
    activeIndex != null ? config.bars[activeIndex] : config.bars[config.bars.length - 1];

  return (
    <div className="kpi-viz-wrap">
      <div className="kpi-viz-stack">
        {kind === "successRate" ? (
          <>
            <MiniSegment value={value} tone={config.tone} />
            <MiniSparkline values={config.bars} tone={config.tone} />
          </>
        ) : (
          <MiniBars
            values={config.bars}
            tone={config.tone}
            highlightLast={activeIndex == null}
            activeIndex={activeIndex}
            onHoverIndex={setActiveIndex}
          />
        )}
      </div>
      <span className="kpi-viz-caption">
        {activeIndex != null ? `Point ${activeIndex + 1}: ${activeValue}` : config.hint}
      </span>
    </div>
  );
}
