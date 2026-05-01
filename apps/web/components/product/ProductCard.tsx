'use client'

import { useState } from 'react'
import type { Product, Locale } from '../../lib/types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { en } from '../../lib/i18n/en'
import { ja } from '../../lib/i18n/ja'

interface ProductCardProps {
  product: Product
  locale: Locale
  onAddToCart: (productId: number) => void
}

export function ProductCard({ product, locale, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const t = locale === 'en' ? en : ja
  const isOutOfStock = product.stock <= 0

  const handleAddToCart = () => {
    onAddToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-4 shadow-sm flex flex-col gap-3">
      <div>
        <h3 className="font-semibold text-neutral-900 text-base">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-neutral-500 mt-1 line-clamp-3">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span
          data-testid="product-price"
          className="font-bold text-accent text-lg"
        >
          ¥{product.price.toLocaleString()}
        </span>
        {isOutOfStock ? (
          <Badge variant="error">{t.product.outOfStock}</Badge>
        ) : (
          <Badge variant="success">{t.product.stock}</Badge>
        )}
      </div>

      <Button
        variant="primary"
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className="w-full"
        data-testid="add-to-cart-btn"
      >
        {added ? `✓ ${t.product.added}` : t.product.addToCart}
      </Button>
    </div>
  )
}
