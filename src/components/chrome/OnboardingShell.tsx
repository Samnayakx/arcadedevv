import { BookOpen, Command, MagnifyingGlass } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { ArcadeLogo } from "./ArcadeLogo";

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
        <button type="button" className="onboarding-text-btn">
          Feedback
        </button>
        <button type="button" className="onboarding-kbd-btn onboarding-search-btn" aria-label="Search">
          <MagnifyingGlass size={14} />
          <span>Search...</span>
          <kbd>⌘K</kbd>
        </button>
        <button type="button" className="onboarding-icon-btn" aria-label="Documentation">
          <BookOpen size={18} />
        </button>
        <button type="button" className="onboarding-icon-btn" aria-label="Command palette">
          <Command size={16} weight="bold" />
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
