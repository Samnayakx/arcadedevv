import { motion } from "framer-motion";
import type { AgentFlow } from "../../types";

export function FlowFilterBar({
  flows,
  selected,
  onSelect,
}: {
  flows: AgentFlow[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const pills = [{ id: "all", name: "All flows" }, ...flows.map((f) => ({ id: f.id, name: f.name }))];

  return (
    <div className="flow-filter">
      {pills.map((pill) => (
        <button
          key={pill.id}
          type="button"
          className={`flow-pill ${selected === pill.id ? "active" : ""}`}
          onClick={() => onSelect(pill.id)}
        >
          {selected === pill.id && (
            <motion.span layoutId="flow-pill" className="flow-pill-bg" />
          )}
          {pill.name}
        </button>
      ))}
    </div>
  );
}
