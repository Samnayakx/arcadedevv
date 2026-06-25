import { BookOpen, Command } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { ArcadeLogo } from "./ArcadeLogo";
import { Icon } from "../primitives/Icon";

export function OnboardingHeader({
  headerTrail,
  orgBadge,
  title,
  onBack,
}: {
  headerTrail?: string;
  orgBadge?: string;
  title?: string;
  onBack?: () => void;
}) {
  return (
    <header className="onboarding-header">
      <div className="onboarding-header-left">
        {onBack ? (
          <button type="button" className="onboarding-back" onClick={onBack}>
            Back
          </button>
        ) : (
          <ArcadeLogo />
        )}
        {headerTrail && !onBack && (
          <span className="onboarding-header-trail">
            <span className="onboarding-header-trail-sep">/</span>
            <span className="onboarding-header-trail-text">{headerTrail}</span>
            {orgBadge && <span className="setup-badge setup-badge-header">{orgBadge}</span>}
          </span>
        )}
      </div>
      {title && (
        <div className="onboarding-header-center">{title}</div>
      )}
      {!title && <div className="onboarding-header-center" />}
      <div className="onboarding-header-right">
        <button type="button" className="onboarding-icon-btn" aria-label="Documentation">
          <Icon icon={BookOpen} size="lg" />
        </button>
        <button type="button" className="onboarding-icon-btn" aria-label="Command palette">
          <Icon icon={Command} size="md" weight="bold" />
        </button>
        <div className="onboarding-avatar" aria-hidden>
          SN
        </div>
      </div>
    </header>
  );
}

export function OnboardingShell({
  headerTrail,
  orgBadge,
  children,
  onBack,
  dotted,
}: {
  headerTrail?: string;
  orgBadge?: string;
  children: ReactNode;
  onBack?: () => void;
  dotted?: boolean;
}) {
  return (
    <div className={`onboarding-page${dotted ? " onboarding-page-dotted" : ""}`}>
      <OnboardingHeader headerTrail={headerTrail} orgBadge={orgBadge} onBack={onBack} />
      <div className="onboarding-body">{children}</div>
    </div>
  );
}
