import clsx from "clsx";
import { useMemo, useState, type ReactNode } from "react";

type VizTone = "violet" | "accent" | "warning" | "danger";
type VizKind = "activeAgents" | "successRate" | "blockedUsers" | "criticalFailures";

export const KPI_GRID_COLS = 8;
export const KPI_GRID_ROWS = 8;
export const KPI_GRID_CELLS = KPI_GRID_COLS * KPI_GRID_ROWS;

function deriveTrend(seed: number, end: number) {
  const start = Math.max(1, Math.round(end * 0.55));
  return Array.from({ length: KPI_GRID_COLS }, (_, index) => {
    const progress = index / Math.max(KPI_GRID_COLS - 1, 1);
    const wave = Math.sin((index + seed) * 1.4) * 0.08;
    return Math.max(1, Math.round(start + (end - start) * progress + end * wave));
  });
}

function scaleSeriesCount(count: number, max: number) {
  if (max <= KPI_GRID_ROWS) return Math.min(KPI_GRID_ROWS, Math.max(0, count));
  return Math.max(1, Math.round((count / max) * KPI_GRID_ROWS));
}

function seriesLabel(kind: VizKind, index: number, value: number) {
  const day = KPI_GRID_COLS - index;
  const dayLabel = day === 1 ? "Today" : `${day}d ago`;

  switch (kind) {
    case "activeAgents":
      return `${dayLabel}: ${value} agent${value === 1 ? "" : "s"}`;
    case "blockedUsers":
      return `${dayLabel}: ${value} blocked`;
    case "criticalFailures":
      return `${dayLabel}: ${value} failure${value === 1 ? "" : "s"}`;
    default:
      return `${dayLabel}: ${value}`;
  }
}

function PixelGridShell({
  tone,
  variant,
  children,
  ariaLabel,
}: {
  tone: VizTone;
  variant: "count" | "series";
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div
      className={clsx(
        "kpi-viz kpi-viz-pixel-grid",
        `kpi-viz-pixel-grid-${variant}`,
        `kpi-viz-pixel-${tone}`,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

function CountGrid({
  value,
  tone,
}: {
  value: number;
  tone: VizTone;
}) {
  const filled = Math.min(
    KPI_GRID_CELLS,
    Math.max(0, Math.round((value / 100) * KPI_GRID_CELLS)),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="kpi-viz-interactive">
      <PixelGridShell tone={tone} variant="count" ariaLabel={`${value}% success rate`}>
        {Array.from({ length: KPI_GRID_CELLS }, (_, index) => {
          const rowFromTop = Math.floor(index / KPI_GRID_COLS);
          const col = index % KPI_GRID_COLS;
          const cellNumber = (KPI_GRID_ROWS - 1 - rowFromTop) * KPI_GRID_COLS + col + 1;
          const isFilled = cellNumber <= filled;
          const isHovered = hoveredIndex === index;

          return (
            <button
              key={index}
              type="button"
              className={clsx(
                "kpi-viz-pixel",
                isFilled && "kpi-viz-pixel-solid",
                isFilled && cellNumber === filled && "kpi-viz-pixel-active",
                isHovered && isFilled && "kpi-viz-pixel-hover",
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onClick={(event) => event.stopPropagation()}
              aria-label={isFilled ? `${value}%` : "empty"}
            />
          );
        })}
      </PixelGridShell>
      {hoveredIndex !== null && (() => {
        const rowFromTop = Math.floor(hoveredIndex / KPI_GRID_COLS);
        const col = hoveredIndex % KPI_GRID_COLS;
        const cellNumber = (KPI_GRID_ROWS - 1 - rowFromTop) * KPI_GRID_COLS + col + 1;
        if (cellNumber > filled) return null;
        return (
          <div className="kpi-viz-tooltip">
            {value}% success
            <span className="kpi-viz-tooltip-sub">
              {filled} / {KPI_GRID_CELLS} cells
            </span>
          </div>
        );
      })()}
    </div>
  );
}

function SeriesGrid({
  values,
  tone,
  kind,
}: {
  values: number[];
  tone: VizTone;
  kind: VizKind;
}) {
  const max = Math.max(...values, 1);
  const scaled = values.map((count) => scaleSeriesCount(count, max));
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <div className="kpi-viz-interactive">
      <PixelGridShell
        tone={tone}
        variant="series"
        ariaLabel={`Trend ending at ${values[values.length - 1]}`}
      >
        {Array.from({ length: KPI_GRID_CELLS }, (_, flatIndex) => {
          const col = flatIndex % KPI_GRID_COLS;
          const rowFromTop = Math.floor(flatIndex / KPI_GRID_COLS);
          const rowFromBottom = KPI_GRID_ROWS - 1 - rowFromTop;
          const count = scaled[col];
          const raw = values[col];
          const isSolid = rowFromBottom < count;
          const isLastCol = col === KPI_GRID_COLS - 1;
          const isHoveredCol = hoveredCol === col;

          return (
            <button
              key={flatIndex}
              type="button"
              className={clsx(
                "kpi-viz-pixel",
                isSolid && "kpi-viz-pixel-solid",
                isSolid && isLastCol && "kpi-viz-pixel-active",
                isSolid && isHoveredCol && "kpi-viz-pixel-hover",
              )}
              onMouseEnter={() => setHoveredCol(col)}
              onMouseLeave={() => setHoveredCol(null)}
              onFocus={() => setHoveredCol(col)}
              onBlur={() => setHoveredCol(null)}
              onClick={(event) => event.stopPropagation()}
              aria-label={
                isSolid
                  ? `${seriesLabel(kind, col, raw)} · unit ${rowFromBottom + 1}`
                  : "empty"
              }
            />
          );
        })}
      </PixelGridShell>
      {hoveredCol !== null && (
        <div className="kpi-viz-tooltip">
          {seriesLabel(kind, hoveredCol, values[hoveredCol])}
          <span className="kpi-viz-tooltip-sub">
            {values[hoveredCol]} pixel{values[hoveredCol] === 1 ? "" : "s"} = {values[hoveredCol]}
          </span>
        </div>
      )}
    </div>
  );
}

export function KpiMiniViz({
  kind,
  value,
}: {
  kind: VizKind;
  value: number;
}) {
  const config = useMemo(() => {
    switch (kind) {
      case "activeAgents":
        return { tone: "violet" as const, mode: "series" as const, bars: deriveTrend(2, value) };
      case "successRate":
        return { tone: "accent" as const, mode: "count" as const, bars: deriveTrend(5, value) };
      case "blockedUsers":
        return { tone: "warning" as const, mode: "series" as const, bars: deriveTrend(7, value) };
      case "criticalFailures":
        return { tone: "danger" as const, mode: "series" as const, bars: deriveTrend(11, value) };
    }
  }, [kind, value]);

  if (config.mode === "count") {
    return (
      <div className="kpi-viz-wrap">
        <CountGrid value={value} tone={config.tone} />
      </div>
    );
  }

  return (
    <div className="kpi-viz-wrap">
      <SeriesGrid values={config.bars} tone={config.tone} kind={kind} />
    </div>
  );
}
