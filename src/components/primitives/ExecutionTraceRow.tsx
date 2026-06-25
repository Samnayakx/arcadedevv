import { useState } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import clsx from "clsx";
import type { TraceStep } from "../../types";

export function ExecutionTraceRow({
  time,
  message,
  status,
  steps,
}: {
  time: string;
  message: string;
  status: TraceStep["status"];
  steps?: TraceStep[];
}) {
  const [open, setOpen] = useState(false);
  const hasSteps = steps && steps.length > 0;

  return (
    <div className="execution-trace-row">
      <button
        type="button"
        className="execution-trace-row-main"
        onClick={() => hasSteps && setOpen((value) => !value)}
        disabled={!hasSteps}
      >
        {hasSteps ? (
          open ? <CaretDown size={12} /> : <CaretRight size={12} />
        ) : (
          <span className="execution-trace-spacer" />
        )}
        <span className="execution-trace-time mono">{time}</span>
        <span className="execution-trace-message">{message}</span>
        <span className={clsx("execution-trace-status", `execution-trace-status-${status}`)}>
          {status}
        </span>
      </button>
      {open && hasSteps && (
        <ul className="execution-trace-substeps">
          {steps.map((step, index) => (
            <li key={`${step.time}-${index}`}>
              <span className="mono">{step.time}</span>
              <span>{step.message}</span>
              <span className={`execution-trace-status execution-trace-status-${step.status}`}>
                {step.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
