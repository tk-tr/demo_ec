'use client'

import type { Product, Locale } from '../../lib/types'
import { ProductCard } from './ProductCard'
import { addToCart } from '../../lib/cart'

interface ProductGridProps {
  products: Product[]
  locale: Locale
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  )
}
