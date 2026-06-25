import clsx from "clsx";
import gsap from "gsap";
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

const STACK_GAP = 20;
const STACK_PEEK = 52;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function VerticalStepStack({
  panels,
  currentStep,
}: {
  panels: ReactNode[];
  currentStep: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>(() => panels.map(() => 0));

  useLayoutEffect(() => {
    const measure = () => {
      setHeights(cardRefs.current.map((el) => el?.offsetHeight ?? 0));
    };

    measure();

    const observer = new ResizeObserver(measure);
    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [panels.length, currentStep]);

  const translateY = useMemo(() => {
    if (currentStep <= 0) return 0;

    let total = 0;
    for (let i = 0; i < currentStep; i += 1) {
      total += (heights[i] ?? 0) + STACK_GAP;
    }
    return -(total - STACK_PEEK);
  }, [currentStep, heights]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = prefersReducedMotion();
    const tween = gsap.to(track, {
      y: translateY,
      duration: reduced ? 0 : 0.82,
      ease: reduced ? "none" : "power2.inOut",
      overwrite: "auto",
    });

    return () => {
      tween.kill();
    };
  }, [translateY]);

  return (
    <div
      className={clsx(
        "cf-stack-viewport",
        currentStep > 0 && "cf-stack-viewport--stacked",
      )}
    >
      <div ref={trackRef} className="cf-stack-track">
        {panels.map((panel, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={clsx(
              "wizard-card cf-stack-card",
              index < currentStep && "cf-stack-card-past",
              index === currentStep && "cf-stack-card-active",
              index > currentStep && "cf-stack-card-future",
            )}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
