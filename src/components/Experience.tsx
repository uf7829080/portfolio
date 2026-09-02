import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Building2, MapPin, CalendarDays, Check } from 'lucide-react';
import { experience, extraCurricular } from '../data/experience';
import { SectionHeading } from './ui/Reveal';
import { useCountUp } from '../hooks/useCountUp';

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const branches = useCountUp(2, inView, 1100);
  const areas = useCountUp(experience.nodes.length, inView, 1400);

  return (
    <section id="experience" className="section">
      <div className="shell" ref={ref}>
        <SectionHeading
          index="02 / Experience"
          title="Real-world experience"
          lead="Not a simulation of business context — three years of actually running one, alongside a full-time degree."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          {/* Role card */}
          <div>
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-azure" />
                  {experience.company}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-ink-faint" />
                  {experience.location}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl text-ink md:text-3xl">{experience.role}</h3>

              <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
                <CalendarDays className="h-3.5 w-3.5" />
                {experience.period}
              </p>

              <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-muted">
                {experience.summary}
              </p>

              <div className="my-6 hairline" />

              <ul className="space-y-3">
                {experience.responsibilities.map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex gap-3 text-[14px] leading-relaxed text-ink-muted"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-azure/70" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <Metric value={branches} label="Branches coordinated" />
                <Metric value={areas} label="Areas of responsibility" />
              </div>
            </div>

            <div className="glass mt-5 rounded-2xl p-5 md:p-6">
              <p className="eyebrow mb-3">Extra-curricular</p>
              <h4 className="text-[15px] text-ink">{extraCurricular.title}</h4>
              <ul className="mt-3 space-y-1.5">
                {extraCurricular.points.map((point) => (
                  <li key={point} className="text-[13.5px] leading-relaxed text-ink-muted">
                    — {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <OperationsDashboard />
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <span className="font-display text-3xl tabular-nums text-ink">{value}</span>
      <p className="mt-1 text-[12px] leading-snug text-ink-faint">{label}</p>
    </div>
  );
}

/**
 * A live map of the role: five areas of responsibility with the coordination
 * running between them. Hovering (or focusing) a node explains what it covers.
 */
function OperationsDashboard() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const active = experience.nodes.find((node) => node.id === activeId);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-5 md:p-7">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="eyebrow">Operations map</p>
        <p className="font-mono text-[10px] text-ink-faint">Hover a node</p>
      </div>

      <div className="relative aspect-[4/3.4] w-full sm:aspect-[4/3]">
        {/* Connections */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {experience.connections.map(([fromId, toId]) => {
            const from = experience.nodes.find((node) => node.id === fromId);
            const to = experience.nodes.find((node) => node.id === toId);
            if (!from || !to) return null;
            const lit = activeId === fromId || activeId === toId;

            return (
              <motion.line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={lit ? '#22D3EE' : 'rgba(255,255,255,0.14)'}
                strokeWidth={lit ? 0.5 : 0.3}
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {experience.nodes.map((node, i) => {
          const isHub = node.id === 'ops';
          const isActive = activeId === node.id;

          return (
            <motion.button
              key={node.id}
              type="button"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-offset-4"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              onClick={() => setActiveId(isActive ? null : node.id)}
              initial={{ opacity: 0, scale: 0.75 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              aria-label={`${node.label}: ${node.detail}`}
            >
              <span
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5
                  text-[11px] transition-all duration-300 sm:text-[12px]
                  ${
                    isHub
                      ? 'border-cyan/40 bg-cyan/10 text-ink'
                      : isActive
                        ? 'border-azure/50 bg-azure/10 text-ink'
                        : 'border-white/10 bg-white/[0.04] text-ink-muted'
                  }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isHub ? 'bg-cyan' : 'bg-azure/80'} ${
                    reduced ? '' : 'animate-pulse-node'
                  }`}
                />
                {node.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 min-h-[3.25rem] rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
        <p className="text-[13.5px] leading-relaxed text-ink-muted">
          {active
            ? active.detail
            : 'Five areas, one coordinator — appointments, stock, team and service all route through daily operations.'}
        </p>
      </div>
    </div>
  );
}
