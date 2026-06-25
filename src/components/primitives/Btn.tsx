import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type BtnVariant = "primary" | "secondary" | "ghost" | "link" | "icon";
export type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  iconOnly?: boolean;
  active?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export function Btn({
  variant = "secondary",
  size = "md",
  iconOnly = false,
  active = false,
  loading = false,
  className,
  disabled,
  children,
  ...props
}: BtnProps) {
  const isIcon = variant === "icon" || iconOnly;

  return (
    <button
      className={clsx(
        "btn",
        variant === "icon" ? "btn-ghost" : `btn-${variant}`,
        isIcon && "btn-icon",
        `btn-${size}`,
        active && "is-active",
        loading && "is-loading",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
}
