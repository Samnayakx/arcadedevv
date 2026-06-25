import { Brain, ChatText, Code, Sparkle } from "@phosphor-icons/react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { TraceMapNodeData } from "./traceMapUtils";

function NodeHead({
  kind,
  label,
}: {
  kind: TraceMapNodeData["kind"];
  label: string;
}) {
  const Icon =
    kind === "prompt"
      ? ChatText
      : kind === "reasoning"
        ? Brain
        : kind === "result"
          ? Sparkle
          : Code;

  return (
    <div className="trace-exec-node-head">
      <Icon size={16} weight="duotone" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function TraceMapNode({ data }: NodeProps<Node<TraceMapNodeData>>) {
  if (data.kind === "tool") {
    return (
      <div className="trace-map-node trace-exec-node trace-exec-node-tool flow-map-node">
        <Handle
          id="in-left"
          type="target"
          position={Position.Left}
          className="trace-map-handle"
        />
        <Handle
          id="in-top"
          type="target"
          position={Position.Top}
          className="trace-map-handle trace-map-handle-top"
        />
        <div className="flow-map-node-inner">
          {data.logoUrl ? (
            <img
              src={data.logoUrl}
              alt=""
              className="flow-map-node-logo"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Code size={18} weight="bold" className="flow-map-node-icon" aria-hidden />
          )}
          <code className="trace-exec-tool-code">{data.toolCall}</code>
        </div>
        <Handle
          id="out-right"
          type="source"
          position={Position.Right}
          className="trace-map-handle"
        />
        <Handle
          id="out-bottom"
          type="source"
          position={Position.Bottom}
          className="trace-map-handle trace-map-handle-bottom"
        />
      </div>
    );
  }

  return (
    <div className={`trace-map-node trace-exec-node trace-exec-node-${data.kind}`}>
      <Handle
        id="in-left"
        type="target"
        position={Position.Left}
        className="trace-map-handle"
      />
      <NodeHead kind={data.kind} label={data.label} />
      {data.body && (
        <p
          className={`trace-exec-node-body ${
            data.kind === "result" ? "trace-exec-result-text" : ""
          }`}
        >
          {data.body}
        </p>
      )}
      <Handle
        id="out-right"
        type="source"
        position={Position.Right}
        className="trace-map-handle"
      />
    </div>
  );
}
