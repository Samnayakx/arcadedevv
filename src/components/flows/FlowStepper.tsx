import clsx from "clsx";

export interface FlowStep {
  id: string;
  label: string;
}

export function FlowBulletStepper({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: FlowStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <ol className="cf-bullet-stepper" aria-label="Progress">
      {steps.map((step, i) => {
        const active = i === currentStep;
        const done = i < currentStep;

        return (
          <li key={step.id}>
            <button
              type="button"
              className={clsx(
                "cf-bullet-row",
                active && "cf-bullet-row-active",
                done && "cf-bullet-row-done",
              )}
              onClick={() => onStepClick?.(i)}
              disabled={i > currentStep}
              aria-current={active ? "step" : undefined}
            >
              <span className="cf-bullet-dot" aria-hidden />
              <span>{step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
