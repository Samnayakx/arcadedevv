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
import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import type { AgentFlow, FlowEdge, FlowNode } from "../../types";
import { FlowMapNode } from "./flow/FlowMapNode";
import { buildFlowGraph, type FlowMapNodeData } from "./flow/flowMapUtils";

const nodeTypes = { flowMap: FlowMapNode } as const;

const previewNodes: FlowNode[] = [
  { id: "p1", label: "Support Triage", type: "agent", status: "setup_incomplete" },
  { id: "p2", label: "Gmail.Search", type: "tool", status: "setup_incomplete" },
  { id: "p3", label: "Zendesk.CreateTicket", type: "tool", status: "setup_incomplete" },
  { id: "p4", label: "Slack.SendMessage", type: "tool", status: "setup_incomplete" },
  { id: "p5", label: "Audit log", type: "audit", status: "setup_incomplete" },
];

const previewEdges: FlowEdge[] = [
  { from: "p1", to: "p2" },
  { from: "p2", to: "p3" },
  { from: "p3", to: "p4" },
  { from: "p4", to: "p5" },
];

function FitViewOnChange({ layoutKey }: { layoutKey: string }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fitView({ padding: 0.18, maxZoom: 1 });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fitView, layoutKey]);

  return null;
}

function FlowCanvas({
  nodes,
  edges,
  ghost,
  flows,
  selectedFlowId,
  onSelectFlow,
}: {
  nodes: FlowNode[];
  edges: FlowEdge[];
  ghost?: boolean;
  flows: AgentFlow[];
  selectedFlowId: string;
  onSelectFlow: (id: string) => void;
}) {
  const graph = useMemo(
    () => buildFlowGraph(nodes, edges, ghost),
    [nodes, edges, ghost],
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(
    graph.nodes as Node<FlowMapNodeData>[],
  );
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(graph.edges as Edge[]);

  useEffect(() => {
    setRfNodes(graph.nodes as Node<FlowMapNodeData>[]);
    setRfEdges(graph.edges as Edge[]);
  }, [graph, setRfNodes, setRfEdges]);

  const layoutKey = useMemo(
    () =>
      [
        ghost ? "ghost" : "live",
        nodes.map((node) => node.id).join("|"),
        edges.map((edge) => `${edge.from}->${edge.to}`).join("|"),
      ].join(":"),
    [nodes, edges, ghost],
  );

  return (
    <div className="flow-canvas flow-canvas-react dot-grid-bg">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={!ghost}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        className="flow-react-root"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.25}
          color="rgba(255,255,255,0.14)"
        />
        <FitViewOnChange layoutKey={layoutKey} />
      </ReactFlow>

      {ghost && (
        <div className="flow-canvas-empty-hint">
          <div className="flow-map-node flow-map-node-binding">
            <div className="flow-map-node-inner">
              <Plus size={16} weight="bold" />
              <span className="flow-map-node-title">Binding</span>
            </div>
          </div>
        </div>
      )}

      {!ghost && flows.length > 0 && (
        <div className="flow-canvas-footer">
          {flows.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "flow-canvas-tab",
                (selectedFlowId === item.id ||
                  (selectedFlowId === "all" && item.id === flows[0]?.id)) &&
                  "flow-canvas-tab-active",
              )}
              onClick={() => onSelectFlow(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AgentFlowMap({
  flows,
  selectedFlowId,
  onSelectFlow,
  isEmpty,
  expanded,
}: {
  flows: AgentFlow[];
  selectedFlowId: string;
  onSelectFlow: (id: string) => void;
  isEmpty?: boolean;
  expanded?: boolean;
}) {
  const flow =
    selectedFlowId === "all"
      ? flows[0]
      : flows.find((item) => item.id === selectedFlowId) ?? flows[0];

  const nodes = isEmpty ? previewNodes : flow?.nodes ?? previewNodes;
  const edges = isEmpty ? previewEdges : flow?.edges ?? previewEdges;

  return (
    <div className={clsx("agent-flow-map dashboard-card", expanded && "agent-flow-map-expanded")}>
      <div className="agent-flow-map-header dashboard-card-head">
        <h3>Agent Flow Map</h3>
        <p>
          {isEmpty
            ? "Preview — your flows will appear here after your first tool call"
            : "Connected bindings · live tool and auth status"}
        </p>
      </div>

      <ReactFlowProvider>
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          ghost={isEmpty}
          flows={flows}
          selectedFlowId={selectedFlowId}
          onSelectFlow={onSelectFlow}
        />
      </ReactFlowProvider>
    </div>
  );
}
