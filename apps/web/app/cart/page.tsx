'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProducts } from '../../lib/api'
import { getCart, removeFromCart, updateQuantity } from '../../lib/cart'
import type { CartItemWithProduct } from '../../lib/types'
import { CartItem } from '../../components/cart/CartItem'
import { CartSummary } from '../../components/cart/CartSummary'
import { useLocale } from '../../components/i18n/useLocale'

export default function CartPage() {
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const { messages } = useLocale()

  useEffect(() => {
    const cartItems = getCart()
    if (cartItems.length === 0) return
    getProducts()
      .then((products) => {
        const enriched = cartItems.flatMap((ci) => {
          const product = products.find((p) => p.id === ci.productId)
          return product ? [{ ...ci, product }] : []
        })
        setItems(enriched)
      })
      .catch(() => {})
  }, [])

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity)
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (productId: number) => {
    removeFromCart(productId)
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{messages.cart.title}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-6">{messages.cart.empty}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-medium border border-neutral-300 hover:bg-neutral-50 transition-colors"
          >
            {messages.cart.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <div className="lg:w-72">
            <CartSummary items={items} />
          </div>
        </div>
      )}
    </div>
  )
}
