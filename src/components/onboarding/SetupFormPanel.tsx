import type { ReactNode } from "react";

export function SetupFormPanel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="setup-form-wrap">
      <div className="setup-form-panel panel">
        <header className="setup-form-header">
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        <div className="setup-form-body">{children}</div>
        <footer className="setup-form-footer">{footer}</footer>
      </div>
    </div>
  );
}

export function SetupFormRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="setup-form-row">
      <div className="setup-form-row-label">
        <span>{label}</span>
        {hint && <p>{hint}</p>}
      </div>
      <div className="setup-form-row-control">{children}</div>
    </div>
  );
}

export function SetupSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; badge?: string }[];
}) {
  return (
    <div className="setup-select-wrap">
      <select
        className="setup-input setup-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {options.find((option) => option.value === value)?.badge && (
        <span className="setup-badge">
          {options.find((option) => option.value === value)?.badge}
        </span>
      )}
    </div>
  );
}

export function SetupCheckboxRow({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="setup-checkbox-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="setup-checkbox-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
    </label>
  );
}
