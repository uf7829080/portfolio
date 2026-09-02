import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

type RailwayVisualProps = {
  stages: string[];
  autoPlay?: boolean;
};

/**
 * The gate sequence, animated: a train approaches, the sensor fires, the
 * control logic responds and the gate closes. Schematic on purpose — no
 * specific hardware is implied.
 */
export function RailwayVisual({ stages, autoPlay = false }: RailwayVisualProps) {
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
    const timer = window.setTimeout(() => setStep((current) => current + 1), step === -1 ? 250 : 900);
    return () => window.clearTimeout(timer);
  }, [running, step, stages.length]);

  const replay = () => {
    setStep(-1);
    setRunning(true);
  };

  const sensorHot = step >= 1;
  const gateClosed = step >= 3;

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070A11] p-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0E1524] to-[#070A11]">
          <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label="Railway gate sequence">
            {/* Track */}
            <line x1="0" y1="118" x2="320" y2="118" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
            <line x1="0" y1="126" x2="320" y2="126" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
            {Array.from({ length: 16 }, (_, i) => (
              <line
                key={i}
                x1={10 + i * 20}
                y1="114"
                x2={10 + i * 20}
                y2="130"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
            ))}

            {/* Sensor post */}
            <line x1="150" y1="70" x2="150" y2="112" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <motion.circle
              cx="150"
              cy="66"
              r="6"
              fill={sensorHot ? '#22D3EE' : 'rgba(255,255,255,0.25)'}
              animate={sensorHot && !reduced ? { opacity: [1, 0.35, 1] } : { opacity: 1 }}
              transition={{ duration: 0.9, repeat: sensorHot ? Infinity : 0 }}
            />
            {sensorHot && (
              <motion.circle
                cx="150"
                cy="66"
                r="6"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                style={{ transformOrigin: '150px 66px' }}
              />
            )}

            {/* Control unit */}
            <rect
              x="222"
              y="52"
              width="46"
              height="30"
              rx="5"
              fill={step >= 2 ? 'rgba(77,166,255,0.16)' : 'rgba(255,255,255,0.04)'}
              stroke={step >= 2 ? 'rgba(77,166,255,0.6)' : 'rgba(255,255,255,0.15)'}
            />
            <text
              x="245"
              y="71"
              textAnchor="middle"
              fontSize="9"
              fill={step >= 2 ? '#8CC6FF' : 'rgba(255,255,255,0.35)'}
              fontFamily="monospace"
            >
              CTRL
            </text>
            <line
              x1="150"
              y1="60"
              x2="222"
              y2="64"
              stroke={step >= 2 ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Gate */}
            <line x1="248" y1="86" x2="248" y2="132" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
            <motion.line
              x1="248"
              y1="96"
              x2="248"
              y2="40"
              stroke={gateClosed ? '#FF8A6B' : 'rgba(255,255,255,0.5)'}
              strokeWidth="4"
              strokeLinecap="round"
              animate={{ rotate: gateClosed ? -90 : 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '248px 96px' }}
            />

            {/* Train */}
            <motion.g
              animate={{ x: step < 0 ? -70 : step === 0 ? 20 : step === 1 ? 88 : 118 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            >
              <rect x="0" y="98" width="52" height="22" rx="5" fill="#4DA6FF" opacity="0.85" />
              <rect x="8" y="103" width="10" height="8" rx="2" fill="#05070B" opacity="0.6" />
              <rect x="24" y="103" width="10" height="8" rx="2" fill="#05070B" opacity="0.6" />
              <circle cx="12" cy="124" r="4" fill="rgba(255,255,255,0.5)" />
              <circle cx="40" cy="124" r="4" fill="rgba(255,255,255,0.5)" />
            </motion.g>
          </svg>
        </div>

        <ol className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
          {stages.map((stage, i) => {
            const reached = step >= i;
            return (
              <li key={stage} className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-500
                    ${
                      reached
                        ? 'border-azure/45 bg-azure/10 text-azure-soft'
                        : 'border-white/10 bg-white/[0.03] text-ink-faint'
                    }`}
                >
                  {stage}
                </span>
                {i < stages.length - 1 && (
                  <span
                    className={`h-px w-4 transition-colors duration-500 ${reached ? 'bg-azure/50' : 'bg-white/10'}`}
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
        {running ? 'Running' : 'Run sequence'}
      </button>
    </div>
  );
}
