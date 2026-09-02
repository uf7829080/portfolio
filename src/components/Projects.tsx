import { useRef, useState, type MouseEvent } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Circle } from 'lucide-react';
import { projects, type Project } from '../data/projects';
import { SectionHeading } from './ui/Reveal';
import { DetectionVisual } from './visuals/DetectionVisual';
import { RailwayVisual } from './visuals/RailwayVisual';

export function Projects() {
  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHeading
          index="04 / Projects"
          title="Selected projects"
          lead="Two projects, described as they are — one in progress, one completed and presented."
        />

        <div className="space-y-8 md:space-y-12">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(520px circle at ${x}% ${y}%, rgba(77,166,255,0.10), transparent 60%)`,
  );

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    glowX.set(px * 100);
    glowY.set(py * 100);
    // Subtle — a card that tips too far stops being readable.
    rotateY.set((px - 0.5) * 6);
    rotateX.set((0.5 - py) * 5);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  const flip = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      className="glass group relative overflow-hidden rounded-3xl p-5 md:p-8"
      style={{ rotateX, rotateY, transformPerspective: 1400 }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div
        className={`relative grid gap-7 lg:grid-cols-2 lg:gap-10 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}
      >
        {/* Text column */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.2em] text-ink-faint">{project.index}</span>
            <span className="h-px w-8 bg-white/15" aria-hidden />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-muted">
              {project.category}
            </span>
          </div>

          <h3 className="mt-4 font-display text-2xl leading-tight text-ink md:text-3xl">
            {project.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-[11px] ${
                project.status === 'In progress' ? 'text-cyan' : 'text-ink-muted'
              }`}
            >
              <Circle
                className={`h-2 w-2 ${project.status === 'In progress' ? 'fill-cyan' : 'fill-ink-faint'}`}
              />
              {project.status}
            </span>
            <span className="font-mono text-[11px] text-ink-faint">{project.period}</span>
          </div>

          <p className="mt-5 max-w-prose text-[15px] leading-relaxed text-ink-muted">
            {project.overview}
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2.5">Technologies</p>
              <ul className="space-y-1.5">
                {project.technologies.map((tech) => (
                  <li key={tech} className="text-[13.5px] text-ink-muted">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2.5">My contribution</p>
              <ul className="space-y-1.5">
                {project.contribution.map((item) => (
                  <li key={item} className="text-[13.5px] leading-snug text-ink-muted">
                    — {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Links appear on hover on desktop, always visible on touch */}
          <motion.div
            className="mt-7 flex flex-wrap gap-2.5"
            animate={{ opacity: reduced || hovered ? 1 : 0.55, y: hovered ? 0 : 4 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectLink href={project.github} icon={<Github className="h-3.5 w-3.5" />} label="GitHub" />
            <ProjectLink
              href={project.demo}
              icon={<ExternalLink className="h-3.5 w-3.5" />}
              label="Live demo"
            />
          </motion.div>
        </div>

        {/* Visual column */}
        <div className="lg:pt-1">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              className="w-full rounded-2xl border border-white/[0.08]"
            />
          ) : project.visual === 'detection' ? (
            <DetectionVisual stages={project.stages} autoPlay={hovered} />
          ) : (
            <RailwayVisual stages={project.stages} autoPlay={hovered} />
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectLink({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
}) {
  // '#' means "not published yet" — render it as a disabled state, not a dead link.
  const pending = !href || href === '#';

  if (pending) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/10 px-3.5 py-2 text-[12.5px] text-ink-faint">
        {icon}
        {label} · coming soon
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[12.5px] text-ink-muted transition-colors hover:border-white/30 hover:text-ink"
    >
      {icon}
      {label}
    </a>
  );
}
