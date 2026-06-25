import clsx from "clsx";
import { getBrandLogoUrl } from "../../lib/brandLogos";

export type BrandLogoSize = "sm" | "md" | "lg";

const LOGO_SIZE_MAP: Record<BrandLogoSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

function resolveSize(size: BrandLogoSize | number): number {
  if (typeof size === "number") return size;
  return LOGO_SIZE_MAP[size];
}

export function BrandLogo({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: BrandLogoSize | number;
  className?: string;
}) {
  const px = resolveSize(size);
  const src = getBrandLogoUrl(name, px);

  if (!src) {
    return (
      <span
        className={clsx("brand-logo-fallback", className)}
        style={{ width: px, height: px, fontSize: Math.max(9, px * 0.5) }}
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={clsx("brand-logo", className)}
      width={px}
      height={px}
      style={{ width: px, height: px }}
      loading="lazy"
      decoding="async"
    />
  );
}
