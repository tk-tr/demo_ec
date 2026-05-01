'use client'

import { useState } from 'react'
import type { Product, Locale } from '../../lib/types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Breadcrumb } from '../layout/Breadcrumb'
import { en } from '../../lib/i18n/en'
import { ja } from '../../lib/i18n/ja'

interface ProductDetailProps {
  product: Product
  locale: Locale
  onAddToCart: (productId: number) => void
}

export function ProductDetail({ product, locale, onAddToCart }: ProductDetailProps) {
  const [added, setAdded] = useState(false)
  const t = locale === 'en' ? en : ja
  const isOutOfStock = product.stock <= 0

  const handleAddToCart = () => {
    onAddToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.products, href: '/' },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image placeholder */}
        <div className="bg-neutral-100 rounded-lg aspect-square flex items-center justify-center text-neutral-400 text-sm">
          No image
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span
              data-testid="product-price"
              className="text-3xl font-bold text-accent"
            >
              ¥{product.price.toLocaleString()}
            </span>
            {isOutOfStock ? (
              <Badge variant="error">{t.product.outOfStock}</Badge>
            ) : (
              <Badge variant="success">{t.product.stock}</Badge>
            )}
          </div>

          {product.description && (
            <p className="text-neutral-600 leading-relaxed">{product.description}</p>
          )}

          <Button
            variant="primary"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="w-full lg:w-auto"
            data-testid="add-to-cart-btn"
          >
            {added ? `✓ ${t.product.added}` : t.product.addToCart}
          </Button>
        </div>
      </div>
    </div>
  )
}
