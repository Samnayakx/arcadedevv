import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link" | "accent";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Btn({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: BtnProps) {
  return (
    <button
      className={clsx("btn", `btn-${variant}`, `btn-${size}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}
