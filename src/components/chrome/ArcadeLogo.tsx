import clsx from "clsx";
import arcadeLogoWordmark from "../../assets/arcade-logo-wordmark.png";
import arcadeLogoCompact from "../../assets/arcade-logo-compact.png";

export function ArcadeLogo({ className }: { className?: string }) {
  return (
    <span className={clsx("arcade-logo-wrap", className)}>
      <img
        src={arcadeLogoWordmark}
        alt="Arcade"
        className="arcade-logo arcade-logo-full"
      />
      <img
        src={arcadeLogoCompact}
        alt="Arcade"
        className="arcade-logo arcade-logo-compact"
      />
    </span>
  );
}
