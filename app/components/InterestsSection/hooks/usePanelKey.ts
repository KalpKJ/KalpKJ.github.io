"use client";

import { useCallback, useState } from "react";

/**
 * Gives a panel a key it can stamp onto internal `motion.*` elements so their
 * entrance animation replays — both on activation (the panel remounts via
 * AnimatePresence) and on demand (e.g. a manga page turn) via `replay()`.
 */
export function usePanelKey() {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);
  return { key, replay };
}
