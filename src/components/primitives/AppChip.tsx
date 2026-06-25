import clsx from "clsx";
import { BrandLogo } from "./BrandLogo";

export function parseAppNames(apps: string | string[]): string[] {
  if (Array.isArray(apps)) return apps.filter(Boolean);
  return apps.split(",").map((app) => app.trim()).filter(Boolean);
}

export function parseToolAction(action: string) {
  const dot = action.indexOf(".");
  if (dot <= 0) {
    return { brand: action, suffix: "" };
  }

  return {
    brand: action.slice(0, dot),
    suffix: action.slice(dot + 1),
  };
}

export function AppChip({
  app,
  iconOnly = false,
  size = 14,
}: {
  app: string;
  iconOnly?: boolean;
  size?: number;
}) {
  return (
    <span
      className={clsx("app-chip", iconOnly && "app-chip-icon-only")}
      title={app}
    >
      <span className="app-chip-icon">
        <BrandLogo name={app} size={size} />
      </span>
      {!iconOnly && app}
    </span>
  );
}

export function AppChipList({
  apps,
  iconOnly = false,
  size = 14,
}: {
  apps: string;
  iconOnly?: boolean;
  size?: number;
}) {
  const items = parseAppNames(apps);

  if (iconOnly) {
    return <AppLogoList apps={items} size={size} />;
  }

  return (
    <span className="app-chip-list">
      {items.map((app) => (
        <AppChip key={app} app={app} size={size} />
      ))}
    </span>
  );
}

export function AppLogoList({
  apps,
  size = 14,
}: {
  apps: string | string[];
  size?: number;
}) {
  const items = parseAppNames(apps);

  return (
    <span className="app-logo-list" title={items.join(", ")}>
      {items.map((app) => (
        <span key={app} className="app-logo-item" title={app}>
          <BrandLogo name={app} size={size} />
        </span>
      ))}
    </span>
  );
}

export function ToolActionCell({ action }: { action: string }) {
  const { brand, suffix } = parseToolAction(action);

  return (
    <span className="tool-action-cell" title={action}>
      <span className="app-chip-icon">
        <BrandLogo name={brand} size={14} />
      </span>
      {suffix ? <span className="tool-action-suffix mono">{suffix}</span> : null}
    </span>
  );
}
