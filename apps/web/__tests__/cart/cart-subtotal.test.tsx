// Feature: modern-ui-redesign, Property 7: カートの小計計算の正確性
import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { CartSummary } from '../../components/cart/CartSummary'
import type { CartItemWithProduct } from '../../lib/types'

const cartItemArb: fc.Arbitrary<CartItemWithProduct> = fc.record({
  productId: fc.integer({ min: 1, max: 999 }),
  quantity: fc.integer({ min: 1, max: 99 }),
  product: fc.record({
    id: fc.integer({ min: 1, max: 999 }),
    name: fc.string({ minLength: 1, maxLength: 80 }),
    description: fc.option(fc.string(), { nil: null }),
    price: fc.integer({ min: 1, max: 100_000 }),
    stock: fc.integer({ min: 1, max: 999 }),
  }),
})

describe('Property 7: カートの小計計算の正確性', () => {
  it('subtotal equals sum of price × quantity for any set of cart items', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArb, { minLength: 1, maxLength: 10 }),
        (items) => {
          const expected = items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
          const { container } = render(<CartSummary items={items} />)
          const subtotalEl = container.querySelector('[data-testid="subtotal"]')
          const text = subtotalEl?.textContent ?? ''
          const result =
            text.includes(expected.toLocaleString()) || text.includes(String(expected))
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })

  it('subtotal is 0 for empty cart', () => {
    const { container } = render(<CartSummary items={[]} />)
    const subtotalEl = container.querySelector('[data-testid="subtotal"]')
    expect(subtotalEl?.textContent).toContain('0')
  })
})
