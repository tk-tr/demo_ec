// Feature: modern-ui-redesign, Property 15: インタラクティブ要素の最小タッチターゲットサイズ
// Feature: modern-ui-redesign, Property 20: フォーカスビジブルスタイルの適用
import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { Button, type ButtonVariant, type ButtonSize } from '../../components/ui/Button'

const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

describe('Property 15: インタラクティブ要素の最小タッチターゲットサイズ', () => {
  it('Button always has min-h-[44px] and min-w-[44px] regardless of variant or size', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...sizes),
        (variant, size) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              Label
            </Button>
          )
          const button = container.querySelector('button')!
          const hasMinH = button.className.includes('min-h-[44px]')
          const hasMinW = button.className.includes('min-w-[44px]')
          cleanup()
          return hasMinH && hasMinW
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('Property 20: フォーカスビジブルスタイルの適用', () => {
  it('Button always has focus-visible ring classes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...variants),
        fc.constantFrom(...sizes),
        (variant, size) => {
          const { container } = render(
            <Button variant={variant} size={size}>
              Label
            </Button>
          )
          const button = container.querySelector('button')!
          const hasFocusRing =
            button.className.includes('focus-visible:ring-2') &&
            button.className.includes('focus-visible:ring-accent')
          cleanup()
          return hasFocusRing
        }
      ),
      { numRuns: 100 }
    )
  })
})
