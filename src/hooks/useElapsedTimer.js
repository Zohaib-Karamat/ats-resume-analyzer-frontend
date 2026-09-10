import { useState, useEffect, useRef } from "react";

/**
 * Tracks elapsed seconds while `isActive` is true.
 * Resets to 0 when `isActive` becomes false.
 *
 * @param {boolean} isActive - Start/stop the timer
 * @param {number} [intervalMs=1000] - Update interval in ms
 * @returns {number} elapsed seconds
 */
export function useElapsedTimer(isActive, intervalMs = 1000) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      startRef.current = null;
      if (rafRef.current) {
        clearInterval(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    startRef.current = Date.now();
    setElapsed(0);

    rafRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, intervalMs);

    return () => {
      if (rafRef.current) {
        clearInterval(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, intervalMs]);

  return elapsed;
}
