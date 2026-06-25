import { type Edge, type Node } from "@xyflow/react";
import type { TracePreview } from "../../../types";
import { getBrandLogoUrl } from "../../../lib/brandLogos";

export type TraceMapNodeKind = "prompt" | "reasoning" | "tool" | "result";

export type TraceMapNodeData = {
  kind: TraceMapNodeKind;
  label: string;
  body?: string;
  toolCall?: string;
  logoUrl?: string | null;
  index?: number;
};

const X_PROMPT = 40;
const X_REASONING = 420;
const X_TOOLS = 820;
const X_RESULT = 1220;
const TOOL_GAP = 92;
const BASE_Y = 32;

const EDGE_STYLE = {
  stroke: "rgba(255, 255, 255, 0.22)",
  strokeWidth: 1.5,
};

function toolBrand(toolCall: string) {
  const dot = toolCall.indexOf(".");
  return dot > 0 ? toolCall.slice(0, dot) : toolCall;
}

function toolStackLayout(count: number) {
  if (count === 0) {
    return { toolYs: [] as number[], centerY: BASE_Y };
  }

  const toolYs = Array.from({ length: count }, (_, index) => BASE_Y + index * TOOL_GAP);
  const centerY =
    toolYs.length === 1
      ? toolYs[0]
      : (toolYs[0] + toolYs[toolYs.length - 1]) / 2;

  return { toolYs, centerY };
}

function bezierEdge(
  id: string,
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string,
): Edge {
  return {
    id,
    source,
    target,
    type: "default",
    sourceHandle,
    targetHandle,
    style: EDGE_STYLE,
  };
}

export function buildTraceGraph(preview: TracePreview): {
  nodes: Node<TraceMapNodeData>[];
  edges: Edge[];
} {
  const toolIds = preview.toolCalls.map((_, index) => `tool-${index}`);
  const { toolYs, centerY } = toolStackLayout(preview.toolCalls.length);

  const specs: Array<{ id: string; data: TraceMapNodeData; position: { x: number; y: number } }> =
    [
      {
        id: "prompt",
        data: { kind: "prompt", label: "User prompt", body: preview.userPrompt },
        position: { x: X_PROMPT, y: centerY },
      },
      {
        id: "reasoning",
        data: {
          kind: "reasoning",
          label: "Agent reasoning",
          body: preview.agentReasoning,
        },
        position: { x: X_REASONING, y: centerY },
      },
      ...preview.toolCalls.map((toolCall, index) => {
        const brand = toolBrand(toolCall);
        return {
          id: toolIds[index],
          data: {
            kind: "tool" as const,
            label: toolCall,
            toolCall,
            logoUrl: getBrandLogoUrl(brand, 24),
            index: index + 1,
          },
          position: { x: X_TOOLS, y: toolYs[index] ?? BASE_Y },
        };
      }),
      {
        id: "result",
        data: { kind: "result", label: "Result", body: preview.result },
        position: { x: X_RESULT, y: centerY },
      },
    ];

  const nodes: Node<TraceMapNodeData>[] = specs.map((spec) => ({
    id: spec.id,
    type: "traceMap",
    position: spec.position,
    data: spec.data,
    draggable: true,
    selectable: false,
  }));

  const edges: Edge[] = [
    bezierEdge("prompt-reasoning", "prompt", "reasoning", "out-right", "in-left"),
  ];

  if (toolIds.length === 0) {
    edges.push(bezierEdge("reasoning-result", "reasoning", "result", "out-right", "in-left"));
    return { nodes, edges };
  }

  edges.push(
    bezierEdge("reasoning-tool-0", "reasoning", toolIds[0], "out-right", "in-left"),
  );

  for (let index = 0; index < toolIds.length - 1; index += 1) {
    edges.push(
      bezierEdge(
        `${toolIds[index]}-${toolIds[index + 1]}`,
        toolIds[index],
        toolIds[index + 1],
        "out-bottom",
        "in-top",
      ),
    );
  }

  edges.push(
    bezierEdge(
      `${toolIds[toolIds.length - 1]}-result`,
      toolIds[toolIds.length - 1],
      "result",
      "out-right",
      "in-left",
    ),
  );

  return { nodes, edges };
}
