import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { education } from '../data/education';
import { SectionHeading } from './ui/Reveal';

export function Education() {
  return (
    <section id="education" className="section">
      <div className="shell">
        <SectionHeading
          index="05 / Education"
          title="Education"
          lead="Studying computer science while working — the degree and the day job have run in parallel since 2022."
        />

        <ol className="relative border-l border-white/[0.08] pl-8 md:pl-12">
          {education.map((entry, i) => (
            <motion.li
              key={`${entry.qualification}-${entry.period}`}
              className="relative pb-10 last:pb-0"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="absolute -left-[calc(2rem+5px)] top-1.5 grid h-2.5 w-2.5 place-items-center md:-left-[calc(3rem+5px)]"
                aria-hidden
              >
                <span className="h-2.5 w-2.5 rounded-full bg-iris ring-4 ring-void" />
                <span className="absolute h-6 w-6 rounded-full bg-iris/20 blur-md" />
              </span>

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-lg text-ink md:text-xl">
                  {entry.qualification}
                  {entry.field !== entry.institution && (
                    <span className="text-ink-muted"> · {entry.field}</span>
                  )}
                </h3>
                <span className="font-mono text-[11px] tracking-[0.16em] text-cyan">{entry.period}</span>
              </div>

              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] text-ink-muted">
                <GraduationCap className="h-3.5 w-3.5 text-ink-faint" />
                {entry.institution}
              </p>

              {entry.note && <p className="mt-2 text-[13.5px] text-ink-faint">{entry.note}</p>}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
