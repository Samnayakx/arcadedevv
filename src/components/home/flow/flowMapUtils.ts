import { Position, type Edge, type Node } from "@xyflow/react";
import type { FlowEdge, FlowNode } from "../../../types";

export type FlowMapNodeData = {
  label: string;
  meta?: string;
  nodeType: FlowNode["type"];
  ghost?: boolean;
};

const COL_GAP = 148;
const ROW_OFFSET = 52;
const CENTER_Y = 56;
const START_X = 8;

export function buildFlowGraph(
  nodes: FlowNode[],
  edges: FlowEdge[],
  ghost?: boolean,
): { nodes: Node<FlowMapNodeData>[]; edges: Edge[] } {
  const order = topologicalOrder(nodes, edges);
  const positionById = zigZagPositions(order);

  const rfNodes: Node<FlowMapNodeData>[] = nodes.map((node) => {
    const position = positionById.get(node.id) ?? { x: START_X, y: CENTER_Y };

    return {
      id: node.id,
      type: "flowMap",
      position,
      data: {
        label: node.label,
        meta: node.meta,
        nodeType: node.type,
        ghost,
      },
      draggable: !ghost,
      selectable: false,
    };
  });

  const rfEdges: Edge[] = edges.map((edge, index) => {
    const from = positionById.get(edge.from) ?? { x: 0, y: 0 };
    const to = positionById.get(edge.to) ?? { x: 0, y: 0 };
    const handles = getHandlePositions(from, to);

    return {
      id: `${edge.from}-${edge.to}-${index}`,
      source: edge.from,
      target: edge.to,
      type: "smoothstep",
      ...handles,
      style: {
        stroke: ghost ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.14)",
        strokeWidth: 1,
      },
    };
  });

  return { nodes: rfNodes, edges: rfEdges };
}

function zigZagPositions(order: string[]) {
  const positions = new Map<string, { x: number; y: number }>();
  const total = order.length;

  order.forEach((id, index) => {
    positions.set(id, {
      x: START_X + index * COL_GAP,
      y: getZigZagY(index, total),
    });
  });

  return positions;
}

function getZigZagY(index: number, total: number) {
  if (total <= 1 || index === 0 || index === total - 1) {
    return CENTER_Y;
  }

  const zigIndex = index - 1;
  return zigIndex % 2 === 0 ? CENTER_Y - ROW_OFFSET : CENTER_Y + ROW_OFFSET;
}

function getHandlePositions(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dy) > Math.abs(dx) * 0.45) {
    return dy > 0
      ? { sourcePosition: Position.Bottom, targetPosition: Position.Top }
      : { sourcePosition: Position.Top, targetPosition: Position.Bottom };
  }

  return dx >= 0
    ? { sourcePosition: Position.Right, targetPosition: Position.Left }
    : { sourcePosition: Position.Left, targetPosition: Position.Right };
}

function topologicalOrder(nodes: FlowNode[], edges: FlowEdge[]) {
  const ids = nodes.map((node) => node.id);
  const incoming = new Map(ids.map((id) => [id, 0]));

  for (const edge of edges) {
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  }

  const queue = ids.filter((id) => (incoming.get(id) ?? 0) === 0);
  const ordered: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    ordered.push(current);

    for (const edge of edges.filter((item) => item.from === current)) {
      const nextCount = (incoming.get(edge.to) ?? 1) - 1;
      incoming.set(edge.to, nextCount);
      if (nextCount === 0) queue.push(edge.to);
    }
  }

  return ordered.length > 0 ? ordered : ids;
}
