'use client'

import type { Product } from '../../lib/types'
import { useLocale } from '../i18n/useLocale'
import { ProductDetail } from './ProductDetail'
import { addToCart } from '../../lib/cart'

export function ProductDetailWrapper({ product }: { product: Product }) {
  const { locale } = useLocale()
  return <ProductDetail product={product} locale={locale} onAddToCart={addToCart} />
}
