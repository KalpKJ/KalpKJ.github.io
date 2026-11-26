// Shared motion tokens — Emil-Kowalski-style: purposeful, snappy, no decoration.
import type { Transition } from "framer-motion";

/** Entrances / reveals — gentle settle. */
export const EASE_SETTLE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Snappy state changes — hover, toggle, click. */
export const EASE_SNAP: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** The shared panel swap: outgoing lifts up + fades, incoming rises + fades. */
export const panelVariants = {
  initial: { y: 12, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: EASE_SETTLE, delay: 0.08 },
  },
  exit: {
    y: -12,
    opacity: 0,
    transition: { duration: 0.28, ease: EASE_SNAP },
  },
};

export const indicatorTransition: Transition = { duration: 0.36, ease: EASE_SETTLE };
