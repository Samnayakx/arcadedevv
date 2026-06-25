import clsx from "clsx";
import arcadeLogo from "../../assets/arcade-logo.png";

export function ArcadeLogo({ className }: { className?: string }) {
  return (
    <img
      src={arcadeLogo}
      alt="Arcade"
      className={clsx("arcade-logo", className)}
    />
  );
}
