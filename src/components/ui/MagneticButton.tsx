import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Variant = 'primary' | 'ghost';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** How far the button drifts toward the cursor, in pixels. */
  strength?: number;
};

type MagneticButtonProps = BaseProps &
  ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

const styles: Record<Variant, string> = {
  primary:
    'bg-ink text-void hover:bg-white border border-transparent shadow-[0_18px_50px_-24px_rgba(140,198,255,0.9)]',
  ghost: 'glass text-ink hover:border-white/25',
};

/**
 * Button that leans toward the pointer while it is over it. Disabled entirely
 * on touch devices and when the OS asks for reduced motion.
 */
export function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  strength = 14,
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({ x: x * strength, y: y * strength });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const inner = (
    <span className="relative z-10 flex items-center gap-2 font-medium">{children}</span>
  );

  const shared = `group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px]
    transition-colors duration-300 ${styles[variant]}`;

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.5 }}
    >
      {href ? (
        <a className={`${shared} ${className}`} href={href}>
          {inner}
        </a>
      ) : (
        <button type="button" className={`${shared} ${className}`} onClick={onClick}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
