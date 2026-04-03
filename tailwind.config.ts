import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080807',
        dark: '#0d0c0b',
        accent: '#FFD000',
        'accent-dim': 'rgba(255,208,0,0.12)',
        forest: '#1e2418',
        'forest-mid': '#2a3020',
        text: '#f0ede6',
        'text-muted': '#a09d96',
      },
      fontFamily: {
        display: ['var(--font-display)', '"Black Ops One"', 'cursive'],
        body: ['var(--font-body)', '"DM Sans"', 'sans-serif'],
        head: ['Rajdhani', 'sans-serif'],
      },
      borderRadius: {
        tactical: '2px',
      },
      boxShadow: {
        'accent-glow': '0 0 0 2px rgba(255,208,0,0.35)',
        'accent-card': '0 8px 32px rgba(255,208,0,0.08)',
        'accent-hover': '0 12px 40px rgba(255,208,0,0.18)',
      },
      backgroundImage: {
        'diagonal-stripes':
          'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,208,0,0.025) 8px, rgba(255,208,0,0.025) 10px)',
        'noise-overlay':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'scroll-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
        'scroll-bounce': 'scroll-bounce 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
