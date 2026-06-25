import {
  CheckCircle,
  CircleDashed,
  Clock,
  Key,
  RocketLaunch,
  ShieldWarning,
  Warning,
} from "@phosphor-icons/react";
import clsx from "clsx";
import type { FlowStatus, RunStatus } from "../../types";

const statusConfig: Record<
  string,
  { color: string; bg: string; label: string; Icon: typeof CheckCircle }
> = {
  healthy: { color: "var(--success)", bg: "var(--success-dim)", label: "Healthy", Icon: CheckCircle },
  needs_auth: { color: "var(--amber)", bg: "var(--amber-dim)", label: "Needs auth", Icon: Key },
  policy_blocked: { color: "var(--amber)", bg: "var(--amber-dim)", label: "Policy blocked", Icon: ShieldWarning },
  degraded: { color: "var(--rose)", bg: "var(--rose-dim)", label: "Degraded", Icon: Warning },
  waiting_for_client: { color: "var(--text-dim)", bg: "var(--info-dim)", label: "Waiting for client", Icon: Clock },
  ready_to_deploy: { color: "var(--text-dim)", bg: "var(--panel2)", label: "Ready to deploy", Icon: RocketLaunch },
  setup_incomplete: { color: "var(--text-dim)", bg: "var(--panel2)", label: "Setup incomplete", Icon: CircleDashed },
  success: { color: "var(--success)", bg: "var(--success-dim)", label: "Success", Icon: CheckCircle },
  blocked: { color: "var(--amber)", bg: "var(--amber-dim)", label: "Blocked", Icon: ShieldWarning },
  failed: { color: "var(--rose)", bg: "var(--rose-dim)", label: "Failed", Icon: Warning },
  running: { color: "var(--text-dim)", bg: "var(--panel2)", label: "Running", Icon: Clock },
  waiting_auth: { color: "var(--amber)", bg: "var(--amber-dim)", label: "Waiting for auth", Icon: Key },
  waiting_approval: { color: "var(--amber)", bg: "var(--amber-dim)", label: "Pending approval", Icon: ShieldWarning },
};

export function StatusBadge({
  status,
  small,
}: {
  status: FlowStatus | RunStatus | string;
  small?: boolean;
}) {
  const cfg = statusConfig[status] ?? statusConfig.healthy;
  const { Icon, color, bg, label } = cfg;

  return (
    <span
      className={clsx("status-badge", small && "status-badge-sm")}
      style={{ color, background: bg }}
    >
      <Icon size={small ? 12 : 14} weight="fill" />
      {label}
    </span>
  );
}
