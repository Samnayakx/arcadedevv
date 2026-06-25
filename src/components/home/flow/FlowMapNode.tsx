import { Code, Key, ListBullets, ShieldWarning } from "@phosphor-icons/react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import clsx from "clsx";
import type { FlowMapNodeData } from "./flowMapUtils";
import { getFlowNodePresentation } from "./flowNodePresentation";

function NodeIcon({ kind }: { kind: ReturnType<typeof getFlowNodePresentation>["kind"] }) {
  switch (kind) {
    case "agent":
      return <Code size={16} weight="bold" className="flow-map-node-icon" />;
    case "audit":
      return <ListBullets size={16} weight="bold" className="flow-map-node-icon" />;
    case "auth":
      return <Key size={16} weight="bold" className="flow-map-node-icon" />;
    case "policy":
      return <ShieldWarning size={16} weight="bold" className="flow-map-node-icon" />;
    default:
      return <Code size={16} weight="bold" className="flow-map-node-icon" />;
  }
}

export function FlowMapNode({ data }: NodeProps<Node<FlowMapNodeData>>) {
  const presentation = getFlowNodePresentation(data.label, data.nodeType);

  return (
    <div
      className={clsx(
        "flow-map-node",
        data.ghost && "flow-map-node-ghost",
        `flow-map-node-${presentation.kind}`,
      )}
    >
      <Handle type="target" position={Position.Left} className="flow-map-handle" />
      <Handle type="source" position={Position.Right} className="flow-map-handle" />

      <div className="flow-map-node-inner">
        {presentation.logoUrl ? (
          <img
            src={presentation.logoUrl}
            alt=""
            className="flow-map-node-logo"
            width={18}
            height={18}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <NodeIcon kind={presentation.kind} />
        )}
        <span className="flow-map-node-title">{presentation.label}</span>
      </div>
    </div>
  );
}
