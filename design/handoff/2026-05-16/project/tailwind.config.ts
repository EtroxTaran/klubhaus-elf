import type { Config } from 'tailwindcss'

// Aurelia Premier — Direction A "Sonntagszeitung"
// Pair with app/globals.css that defines the HSL CSS variables below.

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic — shadcn-style, driven by CSS variables
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))',        foreground: 'hsl(var(--card-foreground))' },
        popover:     { DEFAULT: 'hsl(var(--popover))',     foreground: 'hsl(var(--popover-foreground))' },
        primary:     { DEFAULT: 'hsl(var(--primary))',     foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))',   foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))',       foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))',      foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',

        // Raw brand ramp — only when a semantic token won't do
        brand: {
          paper:       '#f4ede0',
          paper2:      '#fbf6ea',
          paperRule:   '#d9cdb4',
          ink:         '#1a1410',
          inkMute:     '#5a4f44',
          inkSoft:     '#7a6f63',
          scarlet:     '#b7301b',
          scarletSoft: '#f6dcd5',
          scarletDark: '#e8553b', // dark-scheme accent
          ok:          '#3f6a2f',
          warn:        '#a3680f',
          danger:      '#9b1f0a',
        },
      },

      fontFamily: {
        // Newsreader carries headlines, tabloid copy, and player-card names
        display: ['Newsreader', '"Source Serif 4"', 'Georgia', 'serif'],
        // Inter — UI, body, controls
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        // JetBrains Mono — fees, save sizes, scoreboard, ticker
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },

      fontFeatureSettings: {
        // Apply via `.font-tabular` utility (see plugin below)
        tabular: '"tnum","cv11","ss01"',
      },

      borderRadius: {
        // Softer than default shadcn — paper, not glass
        sm:   'calc(var(--radius) - 6px)',   // 8
        md:   'calc(var(--radius) - 4px)',   // 10
        lg:   'var(--radius)',               // 14
        xl:   'calc(var(--radius) + 4px)',   // 18
        '2xl':'calc(var(--radius) + 10px)',  // 24
      },

      spacing: {
        // Thumb-zone reserve at viewport bottom — "bottom 40% rule"
        thumb: '12rem',     // 192px
        // Hub-tile minimum height (so a 2×2 grid clears under the thumb zone)
        hub:   '7rem',      // 112px
        // 44px touch target (WCAG 2.2 AA hit area)
        tap:   '2.75rem',
      },

      keyframes: {
        'event-in':     { '0%': { opacity:0, transform:'translateY(6px)' }, '100%': { opacity:1, transform:'translateY(0)' } },
        'cheer':        { '0%,100%': { transform:'scale(1)' }, '50%': { transform:'scale(1.06)' } },
        'ticker-slide': { '0%': { transform:'translateX(0)' }, '100%': { transform:'translateX(-50%)' } },
        'pulse-dot':    { '0%,100%': { opacity:1 }, '50%': { opacity:.35 } },
      },
      animation: {
        // Short, gated by motion-safe:* utilities at usage sites.
        'event-in':     'event-in .22s ease-out both',
        'cheer':        'cheer .35s ease-out',
        'ticker-slide': 'ticker-slide 28s linear infinite',
        'pulse-dot':    'pulse-dot 1.6s ease-in-out infinite',
      },

      boxShadow: {
        paper: '0 1px 0 rgba(255,255,255,.6) inset, 0 1px 2px rgba(26,20,16,.06)',
        lift:  '0 8px 22px -8px rgba(26,20,16,.40)',
        cta:   '0 8px 22px -6px rgba(183,48,27,.55)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config

/* ───────────────────────────────────────────────────────────────
   app/globals.css — paste the block below alongside the config

   @layer base {
     :root {
       --background: 39 38% 92%;
       --foreground: 22 22% 8%;
       --card: 41 50% 95%;
       --card-foreground: 22 22% 8%;
       --popover: 41 50% 95%;
       --popover-foreground: 22 22% 8%;
       --primary: 22 22% 8%;
       --primary-foreground: 39 38% 92%;
       --secondary: 38 28% 86%;
       --secondary-foreground: 22 22% 8%;
       --muted: 38 28% 86%;
       --muted-foreground: 30 12% 31%;
       --accent: 8 76% 41%;
       --accent-foreground: 0 0% 100%;
       --destructive: 8 88% 33%;
       --destructive-foreground: 0 0% 100%;
       --success: 105 38% 30%;
       --warning: 36 84% 35%;
       --border: 39 32% 78%;
       --input:  39 32% 78%;
       --ring:   8 76% 41%;
       --radius: 14px;
     }
     .dark {
       --background: 28 28% 7%;
       --foreground: 40 60% 90%;
       --card: 27 32% 11%;
       --card-foreground: 40 60% 90%;
       --popover: 27 32% 11%;
       --popover-foreground: 40 60% 90%;
       --primary: 40 60% 90%;
       --primary-foreground: 22 22% 8%;
       --secondary: 27 22% 16%;
       --secondary-foreground: 40 60% 90%;
       --muted: 27 22% 16%;
       --muted-foreground: 32 14% 65%;
       --accent: 12 78% 57%;
       --accent-foreground: 0 0% 100%;
       --destructive: 12 78% 57%;
       --destructive-foreground: 0 0% 100%;
       --success: 95 27% 53%;
       --warning: 36 65% 57%;
       --border: 28 24% 18%;
       --input:  28 24% 18%;
       --ring:   12 78% 57%;
     }
   }
   ─────────────────────────────────────────────────────────────── */
