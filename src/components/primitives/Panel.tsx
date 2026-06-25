import clsx from "clsx";
import type { ReactNode } from "react";

export function Panel({
  children,
  className,
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div className={clsx("panel", padding && "panel-padded", className)}>
      {children}
    </div>
  );
}
