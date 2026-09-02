import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** Fades and lifts children into view once, when they enter the viewport. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/** Splits a line into words and staggers them in — used once, in the hero. */
export function WordReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type SectionHeadingProps = {
  /** Small mono label above the title, e.g. '03 / Skills'. */
  index: string;
  title: string;
  lead?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ index, title, lead, align = 'left' }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className={`mb-12 md:mb-16 ${align === 'center' ? 'mx-auto max-w-prose text-center' : 'max-w-prose'}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="eyebrow">{index}</span>
        <motion.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-white/25 to-transparent"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <h2 className="text-headline text-ink">{title}</h2>
      {lead && <p className="mt-4 text-[15px] leading-relaxed text-ink-muted md:text-base">{lead}</p>}
    </div>
  );
}
