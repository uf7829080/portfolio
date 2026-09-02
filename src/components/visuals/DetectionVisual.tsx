import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

type DetectionVisualProps = {
  stages: string[];
  /** Starts the sequence when the card is hovered or opened. */
  autoPlay?: boolean;
};

/**
 * A conceptual view of the detection pipeline: a frame is scanned, passed
 * through analysis, and a result is produced. Deliberately schematic — it does
 * not claim any specific model, dataset or accuracy figure.
 */
export function DetectionVisual({ stages, autoPlay = false }: DetectionVisualProps) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(reduced ? stages.length - 1 : -1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (autoPlay && !running && step === -1 && !reduced) setRunning(true);
  }, [autoPlay, running, step, reduced]);

  useEffect(() => {
    if (!running) return;
    if (step >= stages.length - 1) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), step === -1 ? 250 : 780);
    return () => window.clearTimeout(timer);
  }, [running, step, stages.length]);

  const replay = () => {
    setStep(-1);
    setRunning(true);
  };

  const scanning = running && step >= 0 && step < stages.length - 1;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070A11] p-5">
        {/* Frame being examined */}
        <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0E1524] to-[#070A11]">
          <div className="grid-lines absolute inset-0 opacity-60" />

          {/* Abstract face-frame markers rather than a stock photo */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative h-24 w-20 rounded-[45%] border border-white/15 sm:h-28 sm:w-24">
              {[
                'left-0 top-0 border-l border-t',
                'right-0 top-0 border-r border-t',
                'left-0 bottom-0 border-l border-b',
                'right-0 bottom-0 border-r border-b',
              ].map((corner) => (
                <span
                  key={corner}
                  className={`absolute h-4 w-4 border-cyan/70 ${corner}`}
                  style={{ margin: '-8px' }}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* Scan sweep */}
          {scanning && (
            <motion.div
              className="absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-cyan/25 to-transparent"
              initial={{ top: '-15%' }}
              animate={{ top: ['-15%', '100%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            Input frame
          </span>
        </div>

        {/* Pipeline */}
        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
          {stages.map((stage, i) => {
            const reached = step >= i;
            return (
              <li key={stage} className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-500
                    ${
                      reached
                        ? 'border-cyan/45 bg-cyan/10 text-cyan-soft'
                        : 'border-white/10 bg-white/[0.03] text-ink-faint'
                    }`}
                >
                  {stage}
                </span>
                {i < stages.length - 1 && (
                  <span
                    className={`h-px w-4 transition-colors duration-500 ${reached ? 'bg-cyan/50' : 'bg-white/10'}`}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <button
        type="button"
        onClick={replay}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:border-white/25 hover:text-ink"
      >
        {running ? <RotateCcw className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {running ? 'Analysing' : 'Run analysis'}
      </button>
    </div>
  );
}
