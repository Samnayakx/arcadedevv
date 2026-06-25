import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Key,
  Lightning,
  Pulse,
  ShieldCheck,
  UserCheck,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { staggerSlow } from "../../app/motion";

interface TraceStep {
  label: string;
  done: boolean;
  icon: "user" | "key" | "bolt" | "shield" | "check";
}

const iconMap = {
  user: UserCheck,
  key: Key,
  bolt: Lightning,
  shield: ShieldCheck,
  check: CheckCircle,
};

export function LiveTracePanel({
  title = "Live trace",
  status,
  steps,
  waitingMessage = "Waiting for your agent's first tool call.",
}: {
  title?: string;
  status: "waiting" | "active" | "complete";
  steps?: TraceStep[];
  waitingMessage?: string;
}) {
  const statusColor =
    status === "active" ? "var(--warning)" : "var(--text-faint)";

  return (
    <div className="live-trace-panel">
      <div className="live-trace-header">
        <Pulse size={16} weight="fill" color={statusColor} />
        <span>{title}</span>
        <span className={clsx("live-trace-status", `live-trace-${status}`)}>
          {status === "waiting" ? "Waiting" : status === "active" ? "Running" : "Complete"}
        </span>
      </div>

      {status === "waiting" && (
        <p className="live-trace-waiting">{waitingMessage}</p>
      )}

      {steps && steps.length > 0 && (
        <motion.ul
          className="live-trace-steps"
          variants={staggerSlow}
          initial="initial"
          animate="animate"
        >
          {steps.map((step) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.li
                key={step.label}
                className={clsx("live-trace-step", step.done && "done")}
                variants={{
                  initial: { opacity: 0, x: -8 },
                  animate: { opacity: 1, x: 0 },
                }}
              >
                {step.done ? (
                  <CheckCircle size={16} weight="fill" color="var(--text-dim)" />
                ) : (
                  <Circle size={16} color="var(--text-faint)" />
                )}
                <Icon size={14} />
                <span>{step.label}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {status === "complete" && !steps && (
        <p className="live-trace-waiting live-trace-complete">
          Trace logged successfully.
        </p>
      )}
    </div>
  );
}

export function GatewayTracePanel({
  gatewayStatus,
  clientStatus,
  toolCallsStatus,
  steps,
}: {
  gatewayStatus: string;
  clientStatus: string;
  toolCallsStatus: string;
  steps?: TraceStep[];
}) {
  return (
    <div className="live-trace-panel">
      <div className="live-trace-header">
        <Pulse size={16} weight="fill" color="var(--text-faint)" />
        <span>Gateway status</span>
      </div>
      <div className="gateway-status-rows">
        <div><span>Gateway</span><span className="mono">{gatewayStatus}</span></div>
        <div><span>Client</span><span className="mono">{clientStatus}</span></div>
        <div><span>Tool calls</span><span className="mono">{toolCallsStatus}</span></div>
      </div>
      {steps && steps.length > 0 && (
        <motion.ul className="live-trace-steps" variants={staggerSlow} initial="initial" animate="animate">
          {steps.map((step) => (
            <motion.li
              key={step.label}
              className={clsx("live-trace-step", step.done && "done")}
              variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
            >
              <CheckCircle size={16} weight="fill" color="var(--text-dim)" />
              <span>{step.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
