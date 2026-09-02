import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { personal } from '../data/personal';
import { scrollToSection } from '../hooks/useSection';

export function Footer() {
  const links = [
    { label: 'LinkedIn', href: personal.socials.linkedin, icon: Linkedin },
    { label: 'GitHub', href: personal.socials.github, icon: Github },
    { label: 'Email', href: `mailto:${personal.email}`, icon: Mail },
  ];

  return (
    <footer className="relative border-t border-white/[0.06] py-10">
      <div className="shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13.5px] text-ink-muted">
            © {personal.copyrightYear} {personal.fullName}
          </p>
          <p className="mt-1 text-[12.5px] text-ink-faint">Built with React, Three.js &amp; curiosity.</p>
        </div>

        <div className="flex items-center gap-2">
          {links.map(({ label, href, icon: Icon }) => {
            const inactive = href === '#';
            return (
              <a
                key={label}
                href={href}
                aria-label={inactive ? `${label} — link not set yet` : label}
                aria-disabled={inactive}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className={`grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] transition-colors
                  ${inactive ? 'cursor-not-allowed text-ink-faint' : 'text-ink-muted hover:border-white/25 hover:text-ink'}`}
                onClick={inactive ? (event) => event.preventDefault() : undefined}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}

          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[12.5px] text-ink-muted transition-colors hover:border-white/25 hover:text-ink"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
