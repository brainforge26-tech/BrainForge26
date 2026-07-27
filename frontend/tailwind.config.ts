import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Color System (design.md) ─────────────────────────────────────────
      colors: {
        // Backgrounds
        'bg-primary': '#09090B',
        'bg-secondary': '#111114',
        'bg-card': 'rgba(20,20,25,0.85)',
        'bg-glass': 'rgba(255,255,255,0.04)',

        // Borders
        border: 'rgba(255,255,255,0.08)',
        'border-hover': 'rgba(255,255,255,0.15)',

        // Accents - Extra Deep Dark Crimson (Burgundy)
        accent: {
          primary: '#730E27',
          secondary: '#52091B',
          highlight: '#8B1532',
        },

        // Semantic
        success: '#00D26A',
        warning: '#FFC247',
        info: '#4B8CFF',
        error: '#EF4444',

        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#B4B7C5',
        'text-muted': '#7C8193',

        // Shadcn-compatible aliases (used by Radix/Shadcn components)
        background: '#09090B',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#730E27',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#111114',
          foreground: '#B4B7C5',
        },
        muted: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          foreground: '#7C8193',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'rgba(20,20,25,0.85)',
          foreground: '#FFFFFF',
        },
        popover: {
          DEFAULT: '#111114',
          foreground: '#FFFFFF',
        },
        input: 'rgba(255,255,255,0.06)',
        ring: '#730E27',
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fira Code', 'monospace'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
      },

      // ─── Border Radius (design.md: 20-28px) ─────────────────────────────
      borderRadius: {
        none: '0',
        sm: '8px',
        DEFAULT: '12px',
        md: '14px',
        lg: '20px',
        xl: '24px',
        '2xl': '28px',
        '3xl': '32px',
        full: '9999px',
      },

      // ─── Spacing extras ───────────────────────────────────────────────────
      maxWidth: {
        content: '1280px',
      },

      // ─── Box Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        glow: '0 0 16px rgba(115,14,39,0.12)',
        'glow-lg': '0 0 32px rgba(115,14,39,0.18)',
        'glow-cyan': '0 0 20px rgba(0,212,255,0.25)',
        'glow-purple': '0 0 20px rgba(124,92,255,0.25)',
        'glow-pink': '0 16px 40px rgba(115,14,39,0.12)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 48px rgba(0,0,0,0.6)',
        glass: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
      },

      // ─── Backdrop Blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // ─── Animations ───────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 16px rgba(115,14,39,0.12)' },
          '50%': { boxShadow: '0 0 28px rgba(115,14,39,0.18)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-up-slow': 'fade-up 0.8s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-down': 'fade-down 0.6s ease-out both',
        'slide-in-right': 'slide-in-right 0.5s ease-out both',
        'slide-in-left': 'slide-in-left 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        blob: 'blob 7s infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },

      // ─── Background gradients ─────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'accent-gradient': 'linear-gradient(135deg, #730E27 0%, #52091B 100%)',
        'accent-gradient-h': 'linear-gradient(90deg, #730E27 0%, #52091B 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(115,14,39,0.04) 0%, rgba(82,9,27,0.02) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(115,14,39,0.05), transparent)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },

      // ─── Transition durations ─────────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
