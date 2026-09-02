import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, Cpu } from 'lucide-react';
import { journey, personal, type JourneyEntry } from '../data/personal';
import { SectionHeading } from './ui/Reveal';

gsap.registerPlugin(ScrollTrigger);

const trackIcon: Record<JourneyEntry['track'], typeof Cpu> = {
  Education: GraduationCap,
  Work: Briefcase,
  Project: Cpu,
};

const trackAccent: Record<JourneyEntry['track'], string> = {
  Education: 'text-iris-soft',
  Work: 'text-azure-soft',
  Project: 'text-cyan-soft',
};

export function About() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      if (line.current) line.current.style.transform = 'scaleY(1)';
      return;
    }

    // Scrub the timeline's light down the spine as the section passes through.
    const context = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 65%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, [reduced]);

  return (
    <section id="about" className="section">
      <div className="shell">
        <SectionHeading
          index="01 / About"
          title={personal.about.heading}
          lead={personal.about.intro}
        />

        <div className="mb-14 flex flex-wrap gap-2">
          {personal.about.interests.map((interest) => (
            <span key={interest} className="chip">
              {interest}
            </span>
          ))}
        </div>

        <div ref={root} className="relative">
          {/* Spine */}
          <div className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-white/[0.07] md:left-1/2 md:-translate-x-1/2" />
          <div
            ref={line}
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-cyan via-azure to-iris md:left-1/2 md:-translate-x-1/2"
            style={{ transform: 'scaleY(0)' }}
          />

          <ol className="space-y-10 md:space-y-0">
            {journey.map((entry, i) => (
              <JourneyItem key={entry.year} entry={entry} index={i} />
            ))}
          </ol>
        </div>

        <p className="mt-14 text-[13px] text-ink-faint">
          Languages: {personal.about.languages.join(' · ')}
        </p>
      </div>
    </section>
  );
}

function JourneyItem({ entry, index }: { entry: JourneyEntry; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });
  const reduced = useReducedMotion();
  const Icon = trackIcon[entry.track];
  const alignRight = index % 2 === 1;

  return (
    <li
      ref={ref}
      className="relative pl-10 md:grid md:grid-cols-2 md:gap-12 md:py-6 md:pl-0"
    >
      {/* Node */}
      <span
        className="absolute left-0 top-1.5 grid h-[23px] w-[23px] place-items-center md:left-1/2 md:top-8 md:-translate-x-1/2"
        aria-hidden
      >
        <motion.span
          className="absolute h-full w-full rounded-full bg-cyan/20 blur-[6px]"
          animate={reduced ? {} : { opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.35, ease: 'easeInOut' }}
        />
        <span className="relative h-2 w-2 rounded-full bg-cyan ring-4 ring-void" />
      </span>

      <motion.div
        className={alignRight ? 'md:col-start-2 md:text-left' : 'md:col-start-1 md:text-right'}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`glass rounded-2xl p-5 transition-colors duration-500 hover:border-white/20 md:p-6
            ${alignRight ? 'md:ml-8' : 'md:mr-8'}`}
        >
          <div
            className={`mb-3 flex items-center gap-2.5 ${alignRight ? '' : 'md:flex-row-reverse'}`}
          >
            <Icon className={`h-4 w-4 ${trackAccent[entry.track]}`} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {entry.year} · {entry.track}
            </span>
          </div>
          <h3 className="text-[17px] leading-snug text-ink md:text-lg">{entry.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{entry.detail}</p>
        </div>
      </motion.div>
    </li>
  );
}
