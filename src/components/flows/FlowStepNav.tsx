export function FlowStepNav({
  step,
  setStep,
  max,
  hideNext,
  nextLabel = "Continue",
  onNext,
}: {
  step: number;
  setStep: (n: number) => void;
  max: number;
  onBackStart?: () => void;
  hideNext?: boolean;
  nextLabel?: string;
  onNext?: () => void;
}) {
  const showBack = step > 0;
  const showNext = !hideNext && step < max;

  return (
    <div className="step-nav">
      {showBack ? (
        <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
          Back
        </button>
      ) : (
        <span aria-hidden />
      )}
      {showNext && (
        <button
          type="button"
          className="btn btn-primary btn-md"
          onClick={() => (onNext ? onNext() : setStep(step + 1))}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
