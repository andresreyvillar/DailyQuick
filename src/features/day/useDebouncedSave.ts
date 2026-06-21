import { useEffect, useRef } from "react";

/**
 * Debounce a save callback. `onChange` (re)starts the timer; `flush` saves
 * immediately if there is a pending change. Any pending change is also flushed
 * on unmount, so edits are never lost.
 */
export function useDebouncedSave(save: () => void | Promise<void>, delay = 500) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const saveRef = useRef(save);
  saveRef.current = save;

  const flush = (): void => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (pending.current) {
      pending.current = false;
      void saveRef.current();
    }
  };

  const onChange = (): void => {
    pending.current = true;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      pending.current = false;
      void saveRef.current();
    }, delay);
  };

  useEffect(() => () => flush(), []);

  return { onChange, flush };
}
