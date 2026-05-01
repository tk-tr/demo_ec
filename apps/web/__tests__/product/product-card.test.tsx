// Feature: modern-ui-redesign, Property 3: Product_Card の必須情報表示
// Feature: modern-ui-redesign, Property 4: 在庫切れ Product_Card の状態
import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { ProductCard } from '../../components/product/ProductCard'
import type { Product } from '../../lib/types'

const productArb = fc.record<Product>({
  id: fc.integer({ min: 1, max: 9999 }),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), {
    nil: null,
  }),
  price: fc.integer({ min: 1, max: 10_000_000 }),
  stock: fc.integer({ min: 1, max: 999 }),
})

const outOfStockProductArb = productArb.map((p) => ({ ...p, stock: 0 }))

describe('Property 3: Product_Card の必須情報表示', () => {
  it('always renders product name and price in ¥ format', () => {
    fc.assert(
      fc.property(productArb, (product) => {
        const { container } = render(
          <ProductCard product={product} locale="ja" onAddToCart={() => {}} />
        )

        const nameEl = container.querySelector('h3')
        const priceEl = container.querySelector('[data-testid="product-price"]')

        const nameOk = nameEl?.textContent === product.name
        const priceText = priceEl?.textContent ?? ''
        const priceOk =
          priceText.startsWith('¥') &&
          priceText.includes(product.price.toLocaleString())

        cleanup()
        return nameOk && priceOk
      }),
      { numRuns: 100 }
    )
  })

  it('renders description when present', () => {
    fc.assert(
      fc.property(
        fc.record<Product>({
          id: fc.integer({ min: 1, max: 9999 }),
          name: fc.string({ minLength: 1, maxLength: 80 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          price: fc.integer({ min: 1, max: 10_000_000 }),
          stock: fc.integer({ min: 1, max: 999 }),
        }),
        (product) => {
          const { container } = render(
            <ProductCard product={product} locale="ja" onAddToCart={() => {}} />
          )
          const descEl = container.querySelector('p')
          const result = descEl?.textContent === product.description
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('Property 4: 在庫切れ Product_Card の状態', () => {
  it('out-of-stock product shows error badge and disabled button', () => {
    fc.assert(
      fc.property(outOfStockProductArb, (product) => {
        const { container } = render(
          <ProductCard product={product} locale="ja" onAddToCart={() => {}} />
        )

        const button = container.querySelector(
          '[data-testid="add-to-cart-btn"]'
        ) as HTMLButtonElement | null
        const badge = container.querySelector('.bg-red-100')

        const buttonDisabled = button?.disabled === true
        const badgeExists = badge !== null

        cleanup()
        return buttonDisabled && badgeExists
      }),
      { numRuns: 100 }
    )
  })

  it('in-stock product shows success badge and enabled button', () => {
    fc.assert(
      fc.property(productArb, (product) => {
        const { container } = render(
          <ProductCard product={product} locale="ja" onAddToCart={() => {}} />
        )

        const button = container.querySelector(
          '[data-testid="add-to-cart-btn"]'
        ) as HTMLButtonElement | null
        const badge = container.querySelector('.bg-green-100')

        const buttonEnabled = button?.disabled === false
        const badgeExists = badge !== null

        cleanup()
        return buttonEnabled && badgeExists
      }),
      { numRuns: 100 }
    )
  })
})
