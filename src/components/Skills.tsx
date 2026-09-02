import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { skillGroups, skills, type Skill } from '../data/skills';
import { SectionHeading } from './ui/Reveal';

/**
 * Skills as an ecosystem rather than a bar chart: four clusters around a core,
 * with related skills lighting up together when one is hovered or focused.
 */
export function Skills() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const active = useMemo(() => skills.find((skill) => skill.id === activeId) ?? null, [activeId]);
  const litIds = useMemo(() => {
    if (!active) return new Set<string>();
    return new Set<string>([active.id, ...active.related]);
  }, [active]);

  return (
    <section id="skills" className="section">
      <div className="shell">
        <SectionHeading
          index="03 / Skills"
          title="How the pieces connect"
          lead="Four clusters that overlap in practice. Hover anything to see what it means and what it links to — no invented proficiency scores."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group, groupIndex) => (
              <motion.div
                key={group.id}
                className="glass relative overflow-hidden rounded-2xl p-5"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: groupIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  aria-hidden
                  className="absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500"
                  style={{
                    background: group.accent,
                    opacity: active?.group === group.id ? 0.22 : 0.08,
                  }}
                />

                <div className="mb-4 flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: group.accent }}
                    aria-hidden
                  />
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-muted">
                    {group.label}
                  </h3>
                </div>

                <ul className="flex flex-wrap gap-2">
                  {skills
                    .filter((skill) => skill.group === group.id)
                    .map((skill) => (
                      <SkillChip
                        key={skill.id}
                        skill={skill}
                        accent={group.accent}
                        dimmed={Boolean(active) && !litIds.has(skill.id)}
                        lit={litIds.has(skill.id)}
                        isActive={active?.id === skill.id}
                        reduced={Boolean(reduced)}
                        onEnter={() => setActiveId(skill.id)}
                        onLeave={() => setActiveId(null)}
                      />
                    ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Detail panel — sticky on desktop so it stays beside the clusters */}
          <motion.aside
            className="glass h-fit rounded-2xl p-6 lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            aria-live="polite"
          >
            {active ? (
              <div>
                <p
                  className="mb-2 font-mono text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: skillGroups.find((group) => group.id === active.group)?.accent }}
                >
                  {skillGroups.find((group) => group.id === active.group)?.label}
                </p>
                <h3 className="font-display text-xl text-ink">{active.name}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{active.note}</p>

                {active.related.length > 0 && (
                  <>
                    <div className="my-5 hairline" />
                    <p className="eyebrow mb-2.5">Connects to</p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.related.map((id) => {
                        const related = skills.find((skill) => skill.id === id);
                        if (!related) return null;
                        return (
                          <span key={id} className="chip text-[10.5px]">
                            {related.name}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <p className="eyebrow mb-3">Ecosystem</p>
                <p className="text-[14px] leading-relaxed text-ink-muted">
                  Data work is what I am building toward, business operations is where I already
                  practise it, and the technical side is what ties the two together. Select a skill
                  to see how it links across the clusters.
                </p>
                <div className="my-5 hairline" />
                <p className="text-[13px] text-ink-faint">
                  {skills.length} skills across {skillGroups.length} clusters.
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

type SkillChipProps = {
  skill: Skill;
  accent: string;
  dimmed: boolean;
  lit: boolean;
  isActive: boolean;
  reduced: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

function SkillChip({ skill, accent, dimmed, lit, isActive, reduced, onEnter, onLeave }: SkillChipProps) {
  return (
    <li>
      <button
        type="button"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        onClick={onEnter}
        className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-all duration-300
          ${lit ? 'text-ink' : 'text-ink-muted'}
          ${dimmed ? 'opacity-35' : 'opacity-100'}`}
        style={{
          borderColor: lit ? `${accent}66` : 'rgba(255,255,255,0.1)',
          background: lit ? `${accent}14` : 'rgba(255,255,255,0.03)',
          transform: isActive && !reduced ? 'translateY(-2px)' : 'none',
        }}
      >
        {skill.name}
      </button>
    </li>
  );
}
