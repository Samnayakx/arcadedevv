import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { OnboardingHeader } from "../chrome/OnboardingShell";
import { FlowBulletStepper, type FlowStep } from "./FlowStepper";
import { VerticalStepStack } from "./VerticalStepStack";

export function FlowShell({
  title,
  subtitle,
  steps,
  currentStep,
  onStepClick,
  panels,
  tracePanel,
  onBack,
  onFinish,
  finishLabel = "Go to Project Home",
  showFinish,
  headerTitle,
}: {
  title: string;
  subtitle?: string;
  steps: FlowStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  panels: ReactNode[];
  tracePanel: ReactNode;
  onBack?: () => void;
  onFinish?: () => void;
  finishLabel?: string;
  showFinish?: boolean;
  headerTitle?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="onboarding-flow-page onboarding-page">
      <OnboardingHeader title={headerTitle ?? title} onBack={onBack} />
      <div className="flow-shell dot-grid-bg">
        <div className="flow-shell-inner">
          <aside className="flow-sidebar-title">
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </aside>

          <main className="flow-main">
            <VerticalStepStack panels={panels} currentStep={currentStep} />

            {showFinish && onFinish && (
              <motion.div
                className="flow-finish"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <button type="button" className="btn btn-primary btn-lg" onClick={onFinish}>
                  {finishLabel}
                </button>
              </motion.div>
            )}
          </main>

          <aside className="flow-rail">
            <FlowBulletStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={onStepClick}
            />
            <div className="flow-trace">{tracePanel}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
