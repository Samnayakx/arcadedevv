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

const X_LEFT = 20;
const X_TOOLS = 268;
const X_RESULT = 500;
const Y_PROMPT = 12;
const Y_REASONING = 78;
const FIRST_TOOL_Y = 34;
const TOOL_GAP = 44;

const EDGE_STYLE = {
  stroke: "rgba(255, 255, 255, 0.22)",
  strokeWidth: 1.25,
};

function toolBrand(toolCall: string) {
  const dot = toolCall.indexOf(".");
  return dot > 0 ? toolCall.slice(0, dot) : toolCall;
}

function toolStackLayout(count: number) {
  if (count === 0) {
    return { toolYs: [] as number[], centerY: Y_REASONING + 24 };
  }

  const toolYs = Array.from({ length: count }, (_, index) => FIRST_TOOL_Y + index * TOOL_GAP);
  const centerY =
    toolYs.length === 1
      ? toolYs[0] + 14
      : (toolYs[0] + toolYs[toolYs.length - 1]) / 2 + 14;

  return { toolYs, centerY };
}

function stepEdge(
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
    type: "smoothstep",
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
        position: { x: X_LEFT, y: Y_PROMPT },
      },
      {
        id: "reasoning",
        data: {
          kind: "reasoning",
          label: "Agent reasoning",
          body: preview.agentReasoning,
        },
        position: { x: X_LEFT, y: Y_REASONING },
      },
      ...preview.toolCalls.map((toolCall, index) => {
        const brand = toolBrand(toolCall);
        return {
          id: toolIds[index],
          data: {
            kind: "tool" as const,
            label: toolCall,
            toolCall,
            logoUrl: getBrandLogoUrl(brand, 18),
            index: index + 1,
          },
          position: { x: X_TOOLS, y: toolYs[index] ?? FIRST_TOOL_Y },
        };
      }),
      {
        id: "result",
        data: { kind: "result", label: "Result", body: preview.result },
        position: { x: X_RESULT, y: centerY - 28 },
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
    stepEdge("prompt-reasoning", "prompt", "reasoning", "out-bottom", "in-top"),
  ];

  if (toolIds.length === 0) {
    edges.push(stepEdge("reasoning-result", "reasoning", "result", "out-right", "in-left"));
    return { nodes, edges };
  }

  edges.push(stepEdge("reasoning-tool-0", "reasoning", toolIds[0], "out-right", "in-left"));

  for (let index = 0; index < toolIds.length - 1; index += 1) {
    edges.push(
      stepEdge(
        `${toolIds[index]}-${toolIds[index + 1]}`,
        toolIds[index],
        toolIds[index + 1],
        "out-bottom",
        "in-top",
      ),
    );
  }

  edges.push(
    stepEdge(
      `${toolIds[toolIds.length - 1]}-result`,
      toolIds[toolIds.length - 1],
      "result",
      "out-right",
      "in-left",
    ),
  );

  return { nodes, edges };
}
