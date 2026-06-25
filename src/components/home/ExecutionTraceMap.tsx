import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { Run } from "../../types";
import { StatusBadge } from "../primitives/StatusBadge";
import { TraceMapNode } from "./flow/TraceMapNode";
import { buildTraceGraph, type TraceMapNodeData } from "./flow/traceMapUtils";

const nodeTypes = { traceMap: TraceMapNode } as const;

const MIN_CANVAS_ZOOM = 0.72;

function FitViewOnChange({ layoutKey }: { layoutKey: string }) {
  const { fitView, getViewport, setViewport } = useReactFlow();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.08, maxZoom: 1, minZoom: 0.5, duration: 0 }).then(() => {
        const viewport = getViewport();
        if (viewport.zoom < MIN_CANVAS_ZOOM) {
          setViewport({ ...viewport, zoom: MIN_CANVAS_ZOOM });
        }
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fitView, getViewport, setViewport, layoutKey]);

  return null;
}

function TraceCanvas({ run }: { run: Run }) {
  const preview = run.tracePreview!;

  const graph = useMemo(() => buildTraceGraph(preview), [preview]);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(
    graph.nodes as Node<TraceMapNodeData>[],
  );
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(graph.edges as Edge[]);

  useEffect(() => {
    setRfNodes(graph.nodes as Node<TraceMapNodeData>[]);
    setRfEdges(graph.edges as Edge[]);
  }, [graph, setRfNodes, setRfEdges]);

  const layoutKey = `${run.id}:${preview.toolCalls.join("|")}`;

  return (
    <div className="execution-trace-canvas flow-canvas flow-canvas-react dot-grid-bg">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "rgba(255, 255, 255, 0.22)", strokeWidth: 1.25 },
        }}
        connectionLineStyle={{ stroke: "rgba(255, 255, 255, 0.22)", strokeWidth: 1.5 }}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        className="flow-react-root execution-trace-react"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.25}
          color="rgba(255,255,255,0.14)"
        />
        <FitViewOnChange layoutKey={layoutKey} />
      </ReactFlow>
    </div>
  );
}

export function ExecutionTraceMap({
  runs,
  onOpenTrace,
  expanded,
}: {
  runs: Run[];
  onOpenTrace: (runId: string) => void;
  expanded?: boolean;
}) {
  const traceRuns = runs.filter((run) => run.tracePreview);
  const [selectedRunId, setSelectedRunId] = useState(traceRuns[0]?.id ?? "");

  useEffect(() => {
    if (!traceRuns.some((run) => run.id === selectedRunId)) {
      setSelectedRunId(traceRuns[0]?.id ?? "");
    }
  }, [traceRuns, selectedRunId]);

  const selectedRun = traceRuns.find((run) => run.id === selectedRunId) ?? traceRuns[0];

  if (!selectedRun?.tracePreview) return null;

  return (
    <div
      className={clsx(
        "execution-trace-map dashboard-card dashboard-card-fill",
        expanded && "execution-trace-map-expanded",
      )}
    >
      <div className="dashboard-card-head">
        <div>
          <h3>Recent executions</h3>
          <p className="trace-preview-subtitle">
            {selectedRun.flowName} · {selectedRun.duration} · {selectedRun.user}
          </p>
        </div>
        <div className="trace-preview-head-meta">
          <StatusBadge status={selectedRun.status} small />
          <span className="dashboard-card-meta">{selectedRun.timestamp}</span>
        </div>
      </div>

      <ReactFlowProvider>
        <TraceCanvas run={selectedRun} />
      </ReactFlowProvider>

      <div className="execution-trace-chrome">
        {traceRuns.length > 0 && (
          <div className="execution-trace-tabs" role="tablist" aria-label="Recent runs">
            {traceRuns.map((run) => (
              <button
                key={run.id}
                type="button"
                role="tab"
                aria-selected={run.id === selectedRun.id}
                title={run.name}
                className={clsx(
                  "execution-trace-tab",
                  run.id === selectedRun.id && "execution-trace-tab-active",
                )}
                onClick={() => setSelectedRunId(run.id)}
              >
                {run.name}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          className="execution-trace-open-btn"
          onClick={() => onOpenTrace(selectedRun.id)}
        >
          Open full trace
          <ArrowRight size={14} weight="bold" aria-hidden />
        </button>
      </div>
    </div>
  );
}
