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
import { useEffect, useMemo } from "react";
import type { TracePreview } from "../../types";
import { TraceMapNode } from "../home/flow/TraceMapNode";
import { buildTraceGraph, type TraceMapNodeData } from "../home/flow/traceMapUtils";

const nodeTypes = { traceMap: TraceMapNode } as const;

function TraceCanvasInner({ preview }: { preview: TracePreview }) {
  const graph = useMemo(() => buildTraceGraph(preview), [preview]);
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(
    graph.nodes as Node<TraceMapNodeData>[],
  );
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(graph.edges as Edge[]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    setRfNodes(graph.nodes as Node<TraceMapNodeData>[]);
    setRfEdges(graph.edges as Edge[]);
    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.2, maxZoom: 1, minZoom: 0.35, duration: 200 });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [graph, setRfNodes, setRfEdges, fitView]);

  return (
    <div className="playground-trace-canvas">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        defaultEdgeOptions={{
          type: "default",
          style: { stroke: "rgba(255, 255, 255, 0.18)", strokeWidth: 1.5 },
        }}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        className="flow-react-root"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.08)"
        />
      </ReactFlow>
    </div>
  );
}

export function PlaygroundTraceCanvas({ preview }: { preview: TracePreview }) {
  return (
    <ReactFlowProvider>
      <TraceCanvasInner preview={preview} />
    </ReactFlowProvider>
  );
}
