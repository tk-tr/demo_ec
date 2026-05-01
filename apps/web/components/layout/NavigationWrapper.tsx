'use client'

import { useEffect, useState } from 'react'
import { Navigation } from './Navigation'
import { useLocale } from '../i18n/useLocale'
import { getCartItemCount } from '../../lib/cart'

export function NavigationWrapper() {
  const { locale, setLocale } = useLocale()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setCartCount(getCartItemCount())

    const onStorage = () => setCartCount(getCartItemCount())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <Navigation
      cartItemCount={cartCount}
      locale={locale}
      onLocaleChange={setLocale}
    />
  )
}
