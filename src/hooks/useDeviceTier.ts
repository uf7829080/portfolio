import { useEffect, useState } from 'react';

export type DeviceTier = 'high' | 'low' | 'none';

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Decides how much 3D the browser should be asked to do.
 *  - 'high' : full scene, full particle count
 *  - 'low'  : simplified scene, fewer particles, no distortion
 *  - 'none' : no WebGL at all — components render a CSS fallback
 *
 * Re-evaluates on resize so rotating a tablet does the right thing.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>('high');

  useEffect(() => {
    const evaluate = () => {
      if (!detectWebGL()) {
        setTier('none');
        return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const narrow = window.innerWidth < 900;
      const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency ?? 8;

      const weak = coarse || narrow || memory <= 4 || cores <= 4;
      setTier(reducedMotion || weak ? 'low' : 'high');
    };

    evaluate();
    window.addEventListener('resize', evaluate, { passive: true });
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return tier;
}

/** True when the OS asks for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}
