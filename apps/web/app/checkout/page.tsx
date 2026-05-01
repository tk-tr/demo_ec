'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '../../lib/api'
import { getCart } from '../../lib/cart'
import type { CartItemWithProduct } from '../../lib/types'
import { CheckoutForm } from '../../components/checkout/CheckoutForm'

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItemWithProduct[]>([])

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

  return <CheckoutForm items={items} />
}
