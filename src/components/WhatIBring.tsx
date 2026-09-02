import { useRef, type MouseEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { strengths, type Strength } from '../data/education';
import { SectionHeading } from './ui/Reveal';

export function WhatIBring() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          index="06 / Value"
          title="What I bring"
          lead="The useful part is the overlap: someone who has studied the technical side and has also been responsible for a business running properly on a Tuesday."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {strengths.map((strength, i) => (
            <StrengthCard key={strength.index} strength={strength} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StrengthCard({ strength, index }: { strength: Strength; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 8);
    rotateX.set((0.5 - py) * 7);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="glass group relative overflow-hidden rounded-2xl p-6 md:p-7"
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-azure/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
      />

      <span className="font-mono text-[11px] tracking-[0.22em] text-ink-faint">{strength.index}</span>
      <h3 className="mt-3 font-display text-xl text-ink">{strength.title}</h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">{strength.description}</p>

      <div className="my-5 hairline" />
      <p className="text-[12.5px] leading-snug text-ink-faint">{strength.evidence}</p>
    </motion.div>
  );
}
