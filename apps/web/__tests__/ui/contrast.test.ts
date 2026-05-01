// Feature: modern-ui-redesign, Property 16: カラートークンの WCAG AA コントラスト比
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { hex } from 'wcag-contrast'
import { COLOR_TOKENS } from '../../lib/tokens'

// Foreground/background pairs used in the design system
const contrastPairs = [
  { fg: 'primary-foreground' as const, bg: 'primary' as const, label: 'nav/header text' },
  { fg: 'accent-foreground' as const, bg: 'accent' as const, label: 'CTA button text' },
  { fg: 'surface-foreground' as const, bg: 'surface' as const, label: 'body text on white' },
  { fg: 'neutral-900' as const, bg: 'neutral-50' as const, label: 'body text on light bg' },
  { fg: 'neutral-900' as const, bg: 'surface' as const, label: 'body text on surface' },
] as const

describe('Property 16: カラートークンの WCAG AA コントラスト比', () => {
  it('each defined fg/bg pair meets WCAG AA (4.5:1) contrast ratio', () => {
    for (const pair of contrastPairs) {
      const ratio = hex(COLOR_TOKENS[pair.fg], COLOR_TOKENS[pair.bg])
      expect(
        ratio,
        `${pair.label}: ${pair.fg} on ${pair.bg} ratio=${ratio.toFixed(2)}`
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('Property 16: any sampled contrast pair meets WCAG AA via fast-check', () => {
    fc.assert(
      fc.property(fc.constantFrom(...contrastPairs), (pair) => {
        const ratio = hex(COLOR_TOKENS[pair.fg], COLOR_TOKENS[pair.bg])
        return ratio >= 4.5
      }),
      { numRuns: 100 }
    )
  })
})
