import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { personal } from '../data/personal';

type LoadingScreenProps = {
  /** Set to true once the 3D scene has drawn its first frame. */
  sceneReady: boolean;
  onFinish: () => void;
};

/**
 * Counts to 100 on a short fixed curve, but will not complete until the scene
 * reports ready — so the transition never reveals an empty canvas.
 */
export function LoadingScreen({ sceneReady, onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const elapsed = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 2);
      // Hold just short of 100 until the canvas is genuinely ready.
      const ceiling = sceneReady ? 100 : 92;
      setProgress(Math.min(Math.round(eased * 100), ceiling));
      if (elapsed < 1 || !sceneReady) frame = requestAnimationFrame(tick);
      else setDone(true);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [sceneReady]);

  // Safety valve: if the scene never reports ready (slow network, blocked
  // chunk), reveal the site anyway rather than holding the visitor here.
  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(onFinish, 550);
    return () => window.clearTimeout(timer);
  }, [done, onFinish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative mb-8">
              <span className="font-display text-6xl font-semibold tracking-tight text-ink md:text-7xl">
                {personal.initials}
              </span>
              <motion.span
                aria-hidden
                className="absolute -inset-6 rounded-full bg-azure/20 blur-3xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="h-px w-56 overflow-hidden bg-white/10 md:w-72">
              <motion.div
                className="h-full bg-gradient-to-r from-azure via-cyan to-azure"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="mt-5 flex w-56 items-center justify-between md:w-72">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                Initializing digital experience
              </span>
              <span className="font-mono text-[11px] tabular-nums text-cyan">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
