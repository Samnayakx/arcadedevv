import clsx from "clsx";
import type { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";
import type { ComponentType } from "react";

export type IconSize = "xs" | "sm" | "md" | "lg";

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
};

type PhosphorIcon = ComponentType<PhosphorIconProps>;

interface IconProps {
  icon: PhosphorIcon;
  size?: IconSize;
  weight?: IconWeight;
  className?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
}

export function Icon({
  icon: IconComponent,
  size = "sm",
  weight = "regular",
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={SIZE_MAP[size]}
      weight={weight}
      className={clsx("ui-icon", `ui-icon-${size}`, className)}
      {...props}
    />
  );
}

export function iconSizePx(size: IconSize = "sm"): number {
  return SIZE_MAP[size];
}
