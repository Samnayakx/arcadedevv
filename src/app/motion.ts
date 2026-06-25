export const easeOut = [0.22, 1, 0.36, 1] as const;
export const springSnappy = { type: "spring" as const, stiffness: 420, damping: 32 };
export const springSoft = { type: "spring" as const, stiffness: 280, damping: 28 };

/** Cloudflare wizard vertical stack slide */
export const cloudflareStackSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: easeOut },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const staggerSlow = {
  animate: { transition: { staggerChildren: 0.12 } },
};

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
};

/** Legacy horizontal slide */
export const stepTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.25, ease: easeOut },
};

/** Cloudflare-style directional wizard panel transition */
export const cloudflareStepVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.38, ease: easeOut },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -28 : 28,
    filter: "blur(2px)",
    transition: { duration: 0.22, ease: easeOut },
  }),
};

export const stepMarkerVariants = {
  idle: { scale: 1, borderColor: "rgba(255,255,255,0.2)" },
  active: { scale: 1.08, borderColor: "#ffffff" },
  done: { scale: 1, borderColor: "rgba(255,255,255,0.35)" },
};

export const stepCheckVariants = {
  initial: { scale: 0, opacity: 0, rotate: -40 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: springSnappy,
  },
};

export const progressBarTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
};
