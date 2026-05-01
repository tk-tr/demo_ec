// Feature: modern-ui-redesign, Property 13: 管理画面プロダクトテーブルのデータ表示
// Feature: modern-ui-redesign, Property 14: 管理画面オーダーテーブルのデータ表示
import { describe, it } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { ProductTable } from '../../components/admin/ProductTable'
import { OrderTable } from '../../components/admin/OrderTable'
import type { Product, Order } from '../../lib/types'

const productArb = fc.record<Product>({
  id: fc.integer({ min: 1, max: 9999 }),
  name: fc.string({ minLength: 1, maxLength: 80 }),
  description: fc.option(fc.string(), { nil: null }),
  price: fc.integer({ min: 0, max: 10_000_000 }),
  stock: fc.integer({ min: 0, max: 9999 }),
})

const orderArb = fc.record<Order>({
  id: fc.integer({ min: 1, max: 9999 }),
  customerName: fc.string({ minLength: 1, maxLength: 80 }),
  customerEmail: fc.emailAddress(),
  total: fc.integer({ min: 0, max: 10_000_000 }),
  status: fc.constantFrom('pending', 'completed', 'cancelled'),
  paymentStatus: fc.constantFrom('unpaid', 'paid', 'refunded'),
})

const tableLabels = { id: 'ID', name: 'Name', price: 'Price', stock: 'Stock', actions: 'Actions' }
const orderLabels = { orderId: 'Order ID', customer: 'Customer', price: 'Price', status: 'Status', paymentStatus: 'Payment' }

describe('Property 13: 管理画面プロダクトテーブルのデータ表示', () => {
  it('every product row shows correct id, name, price, stock', () => {
    fc.assert(
      fc.property(
        fc.array(productArb, { minLength: 1, maxLength: 10 }),
        (products) => {
          const { container } = render(
            <ProductTable products={products} labels={tableLabels} />
          )
          const rows = container.querySelectorAll('[data-testid="product-row"]')
          const result = products.every((product, i) => {
            const row = rows[i]
            return (
              row.textContent?.includes(String(product.id)) &&
              row.textContent?.includes(product.name) &&
              row.textContent?.includes(String(product.stock))
            )
          })
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })
})

describe('Property 14: 管理画面オーダーテーブルのデータ表示', () => {
  it('every order row shows correct id, customer name, status, payment status', () => {
    fc.assert(
      fc.property(
        fc.array(orderArb, { minLength: 1, maxLength: 10 }),
        (orders) => {
          const { container } = render(
            <OrderTable orders={orders} labels={orderLabels} />
          )
          const rows = container.querySelectorAll('[data-testid="order-row"]')
          const result = orders.every((order, i) => {
            const row = rows[i]
            return (
              row.textContent?.includes(String(order.id)) &&
              row.textContent?.includes(order.customerName) &&
              row.textContent?.includes(order.status) &&
              row.textContent?.includes(order.paymentStatus)
            )
          })
          cleanup()
          return result
        }
      ),
      { numRuns: 100 }
    )
  })
})
