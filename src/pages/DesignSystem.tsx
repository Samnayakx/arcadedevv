import { Bell, Plus } from "@phosphor-icons/react";
import { Btn } from "../components/primitives/Btn";
import { Icon } from "../components/primitives/Icon";
import { StatusBadge } from "../components/primitives/StatusBadge";

const SPACING_SWATCHES = [
  { token: "--space-1", label: "4px" },
  { token: "--space-2", label: "8px" },
  { token: "--space-3", label: "12px" },
  { token: "--space-4", label: "16px" },
  { token: "--space-5", label: "20px" },
  { token: "--space-6", label: "24px" },
  { token: "--space-7", label: "32px" },
];

export function DesignSystem() {
  return (
    <div className="design-system page-grid section">
      <header className="design-system-header section">
        <h1 className="text-title-lg">Design system</h1>
        <p className="text-body-sm">ArcadeDev tokens, buttons, and type scale reference.</p>
      </header>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Buttons</h3>
        </div>
        <div className="design-system-swatch-grid">
          <Btn variant="primary" size="md">Primary</Btn>
          <Btn variant="secondary" size="md">Secondary</Btn>
          <Btn variant="ghost" size="md">Ghost</Btn>
          <Btn variant="link" size="sm">Link action</Btn>
          <Btn variant="icon" size="sm" aria-label="Notifications">
            <Icon icon={Bell} size="md" />
          </Btn>
          <Btn variant="primary" size="sm">
            <Icon icon={Plus} size="sm" weight="bold" />
            With icon
          </Btn>
          <Btn variant="secondary" size="sm" active>
            Active
          </Btn>
          <Btn variant="primary" size="md" disabled>
            Disabled
          </Btn>
        </div>
      </section>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Typography</h3>
        </div>
        <div className="stack-md" style={{ padding: "var(--card-pad-y) var(--card-pad-x)" }}>
          <p className="text-title-lg">Page title — text-title-lg</p>
          <p className="text-title-sm">Card title — text-title-sm</p>
          <p className="text-body-sm">Body — text-body-sm</p>
          <p className="text-caption">Caption — text-caption</p>
          <p className="text-overline">Overline label</p>
          <p className="mono text-caption">GitHub.CreateIssue — mono caption</p>
        </div>
      </section>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Spacing</h3>
        </div>
        <div className="design-system-spacing" style={{ padding: "var(--card-pad-y) var(--card-pad-x)" }}>
          {SPACING_SWATCHES.map((swatch) => (
            <div key={swatch.token} className="design-system-spacing-row cluster">
              <code className="mono text-caption">{swatch.token}</code>
              <span
                className="design-system-spacing-bar"
                style={{ width: `var(${swatch.token})`, height: `var(${swatch.token})`, background: "var(--accent)" }}
                aria-hidden
              />
              <span className="text-caption">{swatch.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Status badges</h3>
        </div>
        <div className="design-system-swatch-grid" style={{ padding: "var(--card-pad-y) var(--card-pad-x)" }}>
          <StatusBadge status="healthy" />
          <StatusBadge status="needs_auth" />
          <StatusBadge status="policy_blocked" />
          <StatusBadge status="degraded" small />
          <StatusBadge status="success" />
        </div>
      </section>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Tabs</h3>
        </div>
        <div style={{ padding: "var(--card-pad-y) var(--card-pad-x)" }}>
          <div className="tab-bar">
            <button type="button" className="tab active">
              Active tab
              <span className="tab-underline" aria-hidden />
            </button>
            <button type="button" className="tab">
              Inactive
            </button>
          </div>
        </div>
      </section>

      <section className="design-system-section dashboard-card section">
        <div className="dashboard-card-head">
          <h3>Inputs</h3>
        </div>
        <div className="stack-md" style={{ padding: "var(--card-pad-y) var(--card-pad-x)", maxWidth: 360 }}>
          <label className="field-label" htmlFor="ds-input">Field label</label>
          <input id="ds-input" className="input" placeholder="Standard input" />
          <input className="input playground-execute-input" placeholder="Mono tool input" />
        </div>
      </section>

      <footer className="design-system-footer">
        <Btn variant="ghost" size="sm" onClick={() => window.history.back()}>
          Back
        </Btn>
      </footer>
    </div>
  );
}
