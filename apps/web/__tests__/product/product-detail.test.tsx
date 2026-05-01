// Feature: modern-ui-redesign, Property 5: 商品詳細ページの価格フォーマットとバッジ
import { describe, it } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { ProductDetail } from '../../components/product/ProductDetail'
import type { Product } from '../../lib/types'

const productArb = fc.record<Product>({
  id: fc.integer({ min: 1, max: 9999 }),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
  price: fc.integer({ min: 1, max: 10_000_000 }),
  stock: fc.integer({ min: 1, max: 999 }),
})

describe('Property 5: 商品詳細ページの価格フォーマットとバッジ', () => {
  it('price is ¥-formatted and badge matches stock status for any product', () => {
    fc.assert(
      fc.property(productArb, (product) => {
        const { container } = render(
          <ProductDetail product={product} locale="ja" onAddToCart={() => {}} />
        )

        const priceEl = container.querySelector('[data-testid="product-price"]')
        const priceText = priceEl?.textContent ?? ''
        const priceOk =
          priceText.startsWith('¥') &&
          priceText.includes(product.price.toLocaleString())

        const successBadge = container.querySelector('.bg-green-100')
        const errorBadge = container.querySelector('.bg-red-100')
        const badgeOk =
          product.stock > 0 ? successBadge !== null : errorBadge !== null

        cleanup()
        return priceOk && badgeOk
      }),
      { numRuns: 100 }
    )
  })

  it('out-of-stock product has disabled add-to-cart button', () => {
    fc.assert(
      fc.property(
        productArb.map((p) => ({ ...p, stock: 0 })),
        (product) => {
          const { container } = render(
            <ProductDetail product={product} locale="ja" onAddToCart={() => {}} />
          )
          const btn = container.querySelector('[data-testid="add-to-cart-btn"]') as HTMLButtonElement | null
          const result = btn?.disabled === true
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })
})
