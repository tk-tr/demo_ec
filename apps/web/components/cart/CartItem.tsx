'use client'

import type { CartItemWithProduct } from '../../lib/types'

interface CartItemProps {
  item: CartItemWithProduct
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity } = item
  const rowTotal = product.price * quantity

  const decrease = () => {
    if (quantity <= 1) {
      onRemove(product.id)
    } else {
      onQuantityChange(product.id, quantity - 1)
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-200">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900 truncate">{product.name}</p>
        <p className="text-sm text-neutral-500">¥{product.price.toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={decrease}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded border border-neutral-300 hover:bg-neutral-50 text-lg"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => onQuantityChange(product.id, quantity + 1)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded border border-neutral-300 hover:bg-neutral-50 text-lg"
          aria-label="Increase quantity"
        >
          ＋
        </button>
      </div>

      <p className="w-24 text-right font-semibold text-neutral-900">
        ¥{rowTotal.toLocaleString()}
      </p>

      <button
        onClick={() => onRemove(product.id)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  )
}
