'use client'

import { useLocale } from '../i18n/useLocale'
import { ProductGrid } from '../product/ProductGrid'
import type { Product } from '../../lib/types'

export function HomeProducts({ products }: { products: Product[] }) {
  const { locale, messages } = useLocale()

  return (
    <section id="products" className="py-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        {messages.hero.productsHeading}
      </h2>
      <ProductGrid products={products} locale={locale} />
    </section>
  )
}
