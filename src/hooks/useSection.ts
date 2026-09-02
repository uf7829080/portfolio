import { useEffect, useRef, useState } from 'react';

/**
 * Reports which section is currently occupying the middle of the viewport.
 * Uses a single IntersectionObserver rather than a scroll listener.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** Scrolls to a section, honouring reduced-motion and the fixed nav height. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Offset for the fixed nav so the heading is not tucked underneath it.
  const top = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

/** Locks body scroll while a modal or mobile menu is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    document.body.classList.toggle('is-locked', locked);
    return () => document.body.classList.remove('is-locked');
  }, [locked]);
}

/** Normalised page scroll progress (0–1) kept in a ref so it never triggers a re-render. */
export function useScrollProgressRef() {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? window.scrollY / max : 0;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
