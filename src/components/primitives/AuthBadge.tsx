import clsx from "clsx";

const AUTH_STATES = {
  connected: { label: "Connected", className: "auth-badge-connected" },
  expired: { label: "Expired", className: "auth-badge-expired" },
  pending: { label: "Pending", className: "auth-badge-pending" },
} as const;

export function AuthBadge({ status }: { status: keyof typeof AUTH_STATES }) {
  const cfg = AUTH_STATES[status];
  return <span className={clsx("auth-badge", cfg.className)}>{cfg.label}</span>;
}
