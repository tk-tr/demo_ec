'use client'

import Link from 'next/link'
import { useLocale } from '../i18n/useLocale'
import { Button } from '../ui/Button'

export function HeroSection() {
  const { messages } = useLocale()
  const t = messages.hero

  return (
    <section className="relative min-h-[320px] lg:min-h-[480px] -mx-4 px-4 flex items-center bg-primary overflow-hidden">
      {/* dark overlay — ensures text contrast ≥ 4.5:1 above any background */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl py-12">
        <h1 className="text-3xl lg:text-5xl font-bold text-primary-foreground leading-tight">
          {t.heading}
        </h1>
        <p className="mt-4 text-base lg:text-lg text-primary-foreground/80">
          {t.subheading}
        </p>
        <div className="mt-8">
          <Link
            href="#products"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold bg-surface text-primary hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
