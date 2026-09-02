/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05070B',
        surface: '#0A0D14',
        elevated: '#111623',
        line: 'rgba(255,255,255,0.08)',
        ink: {
          DEFAULT: '#F2F5FA',
          muted: '#8B93A7',
          faint: '#5A6274',
        },
        azure: { DEFAULT: '#4DA6FF', soft: '#8CC6FF' },
        cyan: { DEFAULT: '#22D3EE', soft: '#7FE7F5' },
        iris: { DEFAULT: '#7C6CFF', soft: '#A79BFF' },
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 7vw, 5.5rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
        headline: ['clamp(1.9rem, 4.5vw, 3.4rem)', { lineHeight: '1.06', letterSpacing: '-0.03em' }],
      },
      maxWidth: { prose: '66ch' },
      transitionTimingFunction: { cinema: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        pulseNode: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.4)' },
        },
        dash: { to: { strokeDashoffset: '-24' } },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
        'pulse-node': 'pulseNode 3s ease-in-out infinite',
        dash: 'dash 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
