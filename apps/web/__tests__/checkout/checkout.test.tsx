// Feature: modern-ui-redesign
// Property 8: チェックアウトフォームの必須フィールドバリデーション
// Property 9: メールアドレスバリデーション
// Property 10: チェックアウト注文サマリーの完全性
// Property 11: 注文成功時の確認メッセージへの注文 ID 反映
// Property 12: API エラー時のフォーム再有効化
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, cleanup, act, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import * as fc from 'fast-check'
import { LocaleProvider } from '../../components/i18n/LocaleProvider'
import { CheckoutForm } from '../../components/checkout/CheckoutForm'
import type { CartItemWithProduct } from '../../lib/types'

vi.mock('../../lib/api', () => ({
  createOrder: vi.fn(),
}))
vi.mock('../../lib/cart', () => ({
  clearCart: vi.fn(),
  getCart: vi.fn(() => []),
}))

import { createOrder } from '../../lib/api'

const mockOrder: CartItemWithProduct = {
  productId: 1,
  quantity: 2,
  product: { id: 1, name: 'Test Product', description: null, price: 1000, stock: 10 },
}

function renderForm(items: CartItemWithProduct[] = [mockOrder]) {
  return render(
    <LocaleProvider defaultLocale="ja">
      <CheckoutForm items={items} />
    </LocaleProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Property 8: 必須フィールドバリデーション', () => {
  it('empty name triggers name error on submit', () => {
    fc.assert(
      fc.property(fc.constant(''), (_) => {
        const { container } = renderForm()
        const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement
        act(() => { fireEvent.click(submit) })
        const nameError = container.querySelector('#customer-name-error')
        const result = nameError !== null
        cleanup()
        return result
      }),
      { numRuns: 100 }
    )
  })

  it('empty email triggers email error on submit', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 30 }), (name) => {
        const { container } = renderForm()
        const nameInput = container.querySelector('#customer-name') as HTMLInputElement
        const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement
        act(() => {
          fireEvent.change(nameInput, { target: { value: name } })
          fireEvent.click(submit)
        })
        const emailError = container.querySelector('#customer-email-error')
        const result = emailError !== null
        cleanup()
        return result
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 9: メールアドレスバリデーション', () => {
  it('invalid email format triggers email error', () => {
    const invalidEmails = ['notanemail', 'missing@dot', '@nodomain', 'no at sign', 'a@b']
    fc.assert(
      fc.property(fc.constantFrom(...invalidEmails), (badEmail) => {
        const { container } = renderForm()
        const nameInput = container.querySelector('#customer-name') as HTMLInputElement
        const emailInput = container.querySelector('#customer-email') as HTMLInputElement
        const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement
        act(() => {
          fireEvent.change(nameInput, { target: { value: 'Test User' } })
          fireEvent.change(emailInput, { target: { value: badEmail } })
          fireEvent.click(submit)
        })
        const emailError = container.querySelector('#customer-email-error')
        const result = emailError !== null
        cleanup()
        return result
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 10: 注文サマリーの完全性', () => {
  it('all items appear in order summary section', () => {
    const items: CartItemWithProduct[] = [
      { productId: 1, quantity: 1, product: { id: 1, name: 'Item A', description: null, price: 500, stock: 5 } },
      { productId: 2, quantity: 3, product: { id: 2, name: 'Item B', description: null, price: 1200, stock: 2 } },
    ]
    fc.assert(
      fc.property(fc.constant(items), (cartItems) => {
        const { container } = renderForm(cartItems)
        const summary = container.querySelector('[data-testid="order-summary"]')!
        const result = cartItems.every((item) =>
          summary.textContent?.includes(item.product.name)
        )
        cleanup()
        return result
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 11: 注文成功時の確認メッセージへの注文 ID 反映', () => {
  it('success message contains the returned orderId', async () => {
    const orderId = 9876
    vi.mocked(createOrder).mockResolvedValueOnce({ order: { id: orderId } })

    const { container } = renderForm()
    const nameInput = container.querySelector('#customer-name') as HTMLInputElement
    const emailInput = container.querySelector('#customer-email') as HTMLInputElement
    const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Taro Yamada' } })
      fireEvent.change(emailInput, { target: { value: 'taro@example.com' } })
    })
    await act(async () => { fireEvent.click(submit) })

    await waitFor(() => {
      const msg = container.querySelector('[data-testid="success-message"]')
      expect(msg?.textContent).toContain(String(orderId))
    })
    cleanup()
  })
})

describe('Property 12: API エラー時のフォーム再有効化', () => {
  it('form fields are re-enabled after API error', async () => {
    vi.mocked(createOrder).mockRejectedValueOnce(new Error('Server Error'))

    const { container } = renderForm()
    const nameInput = container.querySelector('#customer-name') as HTMLInputElement
    const emailInput = container.querySelector('#customer-email') as HTMLInputElement
    const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Taro Yamada' } })
      fireEvent.change(emailInput, { target: { value: 'taro@example.com' } })
    })
    await act(async () => { fireEvent.click(submit) })

    await waitFor(() => {
      expect((container.querySelector('#customer-name') as HTMLInputElement).disabled).toBe(false)
      expect((container.querySelector('#customer-email') as HTMLInputElement).disabled).toBe(false)
    })
    cleanup()
  })
})
