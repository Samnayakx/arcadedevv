import clsx from "clsx";
import { getBrandLogoUrl } from "../../lib/brandLogos";

export function BrandLogo({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const src = getBrandLogoUrl(name, size);

  if (!src) {
    return (
      <span
        className={clsx("brand-logo-fallback", className)}
        style={{ width: size, height: size, fontSize: Math.max(9, size * 0.5) }}
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
      width={size}
      height={size}
      style={{ width: size, height: size }}
      loading="lazy"
      decoding="async"
    />
  );
}
