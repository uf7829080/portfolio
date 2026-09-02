import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { personal } from '../data/personal';
import { scrollToSection, useActiveSection, useScrollLock } from '../hooks/useSection';

export const NAV_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = NAV_SECTIONS.map((section) => section.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const reduced = useReducedMotion();

  useScrollLock(menuOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    // Let the menu close before scrolling, so the lock is released first.
    window.setTimeout(() => scrollToSection(id), menuOpen ? 220 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center"
        initial={reduced ? { opacity: 0 } : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Primary"
          className={`mt-3 flex w-[calc(100%-1.5rem)] max-w-[1140px] items-center justify-between rounded-full
            px-3 transition-all duration-500 ease-cinema sm:px-4
            ${scrolled ? 'glass py-1.5 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)]' : 'border border-transparent py-2.5'}`}
        >
          <button
            type="button"
            onClick={() => go('home')}
            className="group flex items-center gap-2.5 rounded-full px-2 py-1"
            aria-label={`${personal.fullName} — back to top`}
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/[0.04] font-display text-[13px] font-semibold tracking-tight">
              {personal.initials}
              <span className="absolute inset-0 rounded-full bg-azure/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="hidden text-[13px] text-ink-muted transition-colors group-hover:text-ink sm:block">
              {personal.fullName}
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_SECTIONS.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => go(section.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300
                      ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{section.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => go('contact')}
              className="group hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-void transition-transform duration-300 hover:scale-[1.03] sm:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-void/95 px-8 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-1">
              {NAV_SECTIONS.map((section, i) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => go(section.id)}
                    className="flex w-full items-baseline gap-4 border-b border-white/[0.06] py-4 text-left"
                  >
                    <span className="font-mono text-[11px] text-ink-faint">
                      0{i + 1}
                    </span>
                    <span
                      className={`font-display text-2xl ${active === section.id ? 'text-ink' : 'text-ink-muted'}`}
                    >
                      {section.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href={`mailto:${personal.email}`}
              className="mt-10 inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-void"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {personal.email}
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
