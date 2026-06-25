import clsx from "clsx";
import { useMemo } from "react";

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
}: {
  values: number[];
  tone: VizTone;
  highlightLast?: boolean;
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="kpi-viz kpi-viz-bars">
      {values.map((value, index) => {
        const highlighted = highlightLast && index === values.length - 1;
        return (
          <span
            key={index}
            className={clsx(
              "kpi-viz-bar",
              `kpi-viz-bar-${tone}`,
              highlighted && "kpi-viz-bar-active",
            )}
            style={{ height: `${(value / max) * 100}%` }}
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
  const config = useMemo(() => {
    switch (kind) {
      case "activeAgents":
        return {
          tone: "violet" as const,
          bars: deriveTrend(2, 8, value),
        };
      case "successRate":
        return {
          tone: "accent" as const,
          bars: deriveTrend(5, 10, value),
        };
      case "blockedUsers":
        return {
          tone: "warning" as const,
          bars: deriveTrend(7, 8, value),
        };
      case "criticalFailures":
        return {
          tone: "danger" as const,
          bars: deriveTrend(11, 10, value),
        };
    }
  }, [kind, value]);

  return (
    <div className="kpi-viz-wrap">
      <div className="kpi-viz-stack">
        {kind === "successRate" ? (
          <>
            <MiniSegment value={value} tone={config.tone} />
            <MiniSparkline values={config.bars} tone={config.tone} />
          </>
        ) : (
          <MiniBars values={config.bars} tone={config.tone} highlightLast />
        )}
      </div>
    </div>
  );
}
