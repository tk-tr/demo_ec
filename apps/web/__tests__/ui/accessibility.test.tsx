// Feature: modern-ui-redesign, Property 19: 画像・アイコンボタンのアクセシビリティ属性
import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

describe('Property 19: 画像・アイコンボタンのアクセシビリティ属性', () => {
  it('icon-only Button (no visible text) requires aria-label', () => {
    const ariaLabels = ['Cart', 'Close menu', 'Delete item', 'Edit product', 'Submit']

    fc.assert(
      fc.property(fc.constantFrom(...ariaLabels), (label) => {
        const { container } = render(
          <Button aria-label={label}>
            <Spinner />
          </Button>
        )
        const button = container.querySelector('button')!
        const hasAriaLabel = button.getAttribute('aria-label') === label
        cleanup()
        return hasAriaLabel
      }),
      { numRuns: 100 }
    )
  })

  it('Spinner is always aria-hidden (decorative)', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })

  it('Button with text content is accessible without aria-label', () => {
    const labels = ['Add to Cart', 'Checkout', 'Continue Shopping', 'Place Order']
    fc.assert(
      fc.property(fc.constantFrom(...labels), (text) => {
        const { container } = render(<Button>{text}</Button>)
        const button = container.querySelector('button')!
        const hasText = button.textContent === text
        cleanup()
        return hasText
      }),
      { numRuns: 100 }
    )
  })
})
