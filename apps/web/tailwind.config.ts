// Design token source of truth for Tailwind CSS v4.
// Actual Tailwind theme is configured via @theme in globals.css (CSS-first approach).
// Named exports are used by tokens.ts for programmatic access and property tests.

export const colorTokens = {
  primary: '#1a1a2e',
  'primary-foreground': '#ffffff',
  accent: '#dc2626',
  'accent-foreground': '#ffffff',
  surface: '#ffffff',
  'surface-foreground': '#1a1a2e',
  'neutral-50': '#f9fafb',
  'neutral-100': '#f3f4f6',
  'neutral-200': '#e5e7eb',
  'neutral-300': '#d1d5db',
  'neutral-400': '#9ca3af',
  'neutral-500': '#6b7280',
  'neutral-600': '#4b5563',
  'neutral-700': '#374151',
  'neutral-800': '#1f2937',
  'neutral-900': '#111827',
} as const

export const typographyTokens = {
  fontFamily: {
    sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
    jp: ['Noto Sans JP', 'sans-serif'],
  },
} as const

// Spacing values in px. All values must be multiples of 4 (4px grid).
export const spacingTokens = {
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
} as const

// Minimal Tailwind v4 config (theme is configured via @theme in globals.css)
export default {}
