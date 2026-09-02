import { lazy, Suspense, type MutableRefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { personal } from '../data/personal';
import { MagneticButton } from './ui/MagneticButton';
import { WordReveal } from './ui/Reveal';
import { scrollToSection } from '../hooks/useSection';
import type { DeviceTier } from '../hooks/useDeviceTier';
import { SceneFallback } from './3d/SceneFallback';

// The whole 3D runtime is a separate chunk — the page paints before it arrives.
const HeroScene = lazy(() =>
  import('./3d/HeroScene').then((module) => ({ default: module.HeroScene })),
);

type HeroProps = {
  scroll: MutableRefObject<number>;
  tier: DeviceTier;
  onSceneReady: () => void;
};

export function Hero({ scroll, tier, onSceneReady }: HeroProps) {
  const reduced = useReducedMotion();

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 md:pt-0">
      {/* Scene layer */}
      <div className="pointer-events-none absolute inset-0 opacity-70 md:left-[38%] md:opacity-100">
        <Suspense fallback={<SceneFallback />}>
          <HeroScene
            scroll={scroll}
            tier={tier}
            labels={personal.hero.orbitLabels}
            onReady={onSceneReady}
          />
        </Suspense>
      </div>

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 mask-fade-b" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-iris/10 blur-[120px]" />

      <div className="shell relative z-10 grid w-full items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div className="max-w-xl">
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {personal.hero.label}
          </motion.p>

          <h1 className="text-display text-ink">
            <WordReveal text={personal.hero.greeting} delay={0.3} />
          </h1>

          <motion.p
            className="mt-6 max-w-prose text-lg leading-snug text-ink md:text-2xl"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {personal.hero.statement}
          </motion.p>

          <motion.p
            className="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {personal.hero.support}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton onClick={() => scrollToSection('projects')}>
              Explore my work
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => scrollToSection('contact')}>
              Let&apos;s connect
            </MagneticButton>
          </motion.div>

          <motion.p
            className="mt-8 font-mono text-[11px] tracking-wide text-ink-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {personal.location} · Open to internships and entry-level roles
          </motion.p>
        </div>

        {/* Spacer that reserves the scene's column on desktop */}
        <div aria-hidden className="hidden h-[440px] md:block" />
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink-faint transition-colors hover:text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          {personal.hero.scrollHint}
        </span>
        <motion.span
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
