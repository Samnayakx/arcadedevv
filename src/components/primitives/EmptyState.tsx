import type { ReactNode } from "react";
import { Btn } from "./Btn";

export function EmptyState({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {actions && <div className="empty-state-actions">{actions}</div>}
    </div>
  );
}

export function EmptyStateActions({
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  primary: string;
  secondary?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}) {
  return (
    <>
      <Btn variant="primary" onClick={onPrimary}>
        {primary}
      </Btn>
      {secondary && (
        <Btn variant="secondary" onClick={onSecondary}>
          {secondary}
        </Btn>
      )}
    </>
  );
}
