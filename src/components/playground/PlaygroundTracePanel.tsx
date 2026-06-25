import { LiveTracePanel } from "../flows/LiveTracePanel";
import type { LiveTraceStep } from "../../hooks/usePlaygroundSession";

export function PlaygroundTracePanel({
  liveStatus,
  steps,
}: {
  liveStatus: "waiting" | "active" | "complete";
  steps: LiveTraceStep[];
}) {
  return (
    <aside className="playground-trace-panel" aria-label="Execution trace">
      <div className="playground-trace-panel-head">
        <span className="playground-trace-panel-label">Trace</span>
      </div>

      <LiveTracePanel
        title=""
        status={liveStatus}
        steps={steps.length > 0 ? steps : undefined}
        waitingMessage="Waiting for a prompt."
      />
    </aside>
  );
}
