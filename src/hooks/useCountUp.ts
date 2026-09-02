import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useDeviceTier';

/**
 * Animates 0 → target with an ease-out curve, driven by requestAnimationFrame.
 * Pass `start` from a viewport hook so the count begins when the section appears.
 */
export function useCountUp(target: number, start: boolean, duration = 1600): number {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let frame = 0;
    const began = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - began) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(target * eased));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, duration, reduced]);

  return value;
}
