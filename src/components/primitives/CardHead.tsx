import clsx from "clsx";
import type { ReactNode } from "react";

interface CardHeadProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
  subtitleClassName?: string;
}

export function CardHead({
  title,
  subtitle,
  meta,
  actions,
  className,
  subtitleClassName,
}: CardHeadProps) {
  return (
    <div className={clsx("dashboard-card-head", className)}>
      <div>
        <h3>{title}</h3>
        {subtitle && (
          <p className={clsx("dashboard-card-subtitle", subtitleClassName)}>{subtitle}</p>
        )}
      </div>
      {meta != null && (
        typeof meta === "string" ? (
          <span className="dashboard-card-meta">{meta}</span>
        ) : (
          meta
        )
      )}
      {actions}
    </div>
  );
}
