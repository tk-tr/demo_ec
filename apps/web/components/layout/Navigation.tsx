'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '../../lib/types'
import { en } from '../../lib/i18n/en'
import { ja } from '../../lib/i18n/ja'

interface NavigationProps {
  cartItemCount: number
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}

export function Navigation({ cartItemCount, locale, onLocaleChange }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const t = locale === 'en' ? en : ja

  const navLinks = (
    <>
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {t.nav.home}
      </Link>
      <Link href="/cart" className="relative hover:opacity-80 transition-opacity">
        {t.nav.cart}
        {cartItemCount > 0 && (
          <span
            data-testid="cart-badge"
            className="absolute -top-2 -right-3 bg-accent text-accent-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {cartItemCount}
          </span>
        )}
      </Link>
      <Link href="/admin" className="hover:opacity-80 transition-opacity">
        {t.nav.admin}
      </Link>
    </>
  )

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          EC Store
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks}
          <button
            onClick={() => onLocaleChange(locale === 'en' ? 'ja' : 'en')}
            className="border border-primary-foreground/40 rounded px-2 py-1 text-xs hover:opacity-80 transition-opacity"
            aria-label={t.nav.language}
          >
            {locale === 'en' ? 'JA' : 'EN'}
          </button>
        </div>

        {/* Mobile: locale toggle + hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => onLocaleChange(locale === 'en' ? 'ja' : 'en')}
            className="border border-primary-foreground/40 rounded px-2 py-1 text-xs hover:opacity-80"
            aria-label={t.nav.language}
          >
            {locale === 'en' ? 'JA' : 'EN'}
          </button>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="p-2 hover:opacity-80 transition-opacity"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-primary border-t border-primary-foreground/20 px-4 py-3 flex flex-col gap-4 text-sm font-medium w-full">
          {navLinks}
        </div>
      )}
    </nav>
  )
}
