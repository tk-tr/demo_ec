// Feature: modern-ui-redesign, Property 2: Cart_Indicator バッジ表示の正確性
// Feature: modern-ui-redesign, Property 6: パンくずナビゲーションの商品名反映
import { describe, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { Navigation } from '../../components/layout/Navigation'
import { Breadcrumb } from '../../components/layout/Breadcrumb'

describe('Property 2: Cart_Indicator バッジ表示の正確性', () => {
  it('badge shows the exact cartItemCount when count > 0', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 99 }), (count) => {
        render(
          <Navigation
            cartItemCount={count}
            locale="ja"
            onLocaleChange={() => {}}
          />
        )
        const badge = screen.getByTestId('cart-badge')
        const result = badge.textContent === String(count)
        cleanup()
        return result
      }),
      { numRuns: 100 }
    )
  })

  it('no cart badge is rendered when cartItemCount is 0', () => {
    render(
      <Navigation cartItemCount={0} locale="ja" onLocaleChange={() => {}} />
    )
    expect(screen.queryByTestId('cart-badge')).toBeNull()
    cleanup()
  })
})

describe('Property 6: パンくずナビゲーションの商品名反映', () => {
  it('last breadcrumb item reflects the product name exactly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length > 0),
        (productName) => {
          render(
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: productName },
              ]}
            />
          )
          const items = screen.getAllByRole('listitem')
          const last = items[items.length - 1]
          const result = last.textContent?.includes(productName) ?? false
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })

  it('current page item has aria-current="page"', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length > 0),
        (productName) => {
          const { container } = render(
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: productName },
              ]}
            />
          )
          const current = container.querySelector('[aria-current="page"]')
          const result =
            current !== null && current.textContent === productName
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })
})
