import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "../../app/motion";

export function StepPanel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="step-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: 0.08, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function StepNav({
  step,
  setStep,
  max,
  hideContinue,
}: {
  step: number;
  setStep: (n: number) => void;
  max: number;
  hideContinue?: boolean;
}) {
  return (
    <div className="step-nav">
      {step > 0 && (
        <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
          Back
        </button>
      )}
      {step < max && !hideContinue && (
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={() => setStep(step + 1)}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          Continue
        </motion.button>
      )}
    </div>
  );
}
