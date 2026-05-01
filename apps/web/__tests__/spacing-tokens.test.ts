// Feature: modern-ui-redesign, Property 1: スペーシングトークンの 4px グリッド整合性
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { SPACING_TOKENS } from '../lib/tokens'

describe('Spacing tokens 4px grid alignment', () => {
  it('all spacing values are multiples of 4', () => {
    for (const [key, value] of Object.entries(SPACING_TOKENS)) {
      expect(value % 4, `spacing token "${key}" (${value}px) must be a multiple of 4`).toBe(0)
    }
  })

  it('Property 1: any selected spacing token is a multiple of 4px', () => {
    const keys = Object.keys(SPACING_TOKENS) as (keyof typeof SPACING_TOKENS)[]
    fc.assert(
      fc.property(fc.constantFrom(...keys), (key) => {
        return SPACING_TOKENS[key] % 4 === 0
      }),
      { numRuns: 100 }
    )
  })
})
