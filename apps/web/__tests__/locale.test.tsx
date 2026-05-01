// Feature: modern-ui-redesign, Property 17: ロケール切り替えの双方向性（ラウンドトリップ）
// Feature: modern-ui-redesign, Property 18: ロケール別テキスト表示
import { describe, it, expect } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { LocaleProvider } from '../components/i18n/LocaleProvider'
import { useLocale } from '../components/i18n/useLocale'
import type { Locale } from '../lib/types'
import { en } from '../lib/i18n/en'
import { ja } from '../lib/i18n/ja'

const locales: Locale[] = ['en', 'ja']

function LocaleDisplay() {
  const { locale, setLocale, messages } = useLocale()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="add-to-cart">{messages.product.addToCart}</span>
      <button onClick={() => setLocale(locale === 'en' ? 'ja' : 'en')}>
        toggle
      </button>
    </div>
  )
}

describe('Property 17: ロケール切り替えの双方向性（ラウンドトリップ）', () => {
  it('switching locale twice returns to original locale', () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (startLocale) => {
        const { getByTestId, getByText } = render(
          <LocaleProvider defaultLocale={startLocale}>
            <LocaleDisplay />
          </LocaleProvider>
        )

        expect(getByTestId('locale').textContent).toBe(startLocale)

        act(() => getByText('toggle').click())
        const switched = getByTestId('locale').textContent as Locale
        expect(switched).not.toBe(startLocale)

        act(() => getByText('toggle').click())
        expect(getByTestId('locale').textContent).toBe(startLocale)

        cleanup()
      }),
      { numRuns: 100 }
    )
  })
})

describe('Property 18: ロケール別テキスト表示', () => {
  it('messages match the active locale dictionary', () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const dict = locale === 'en' ? en : ja
        const { getByTestId } = render(
          <LocaleProvider defaultLocale={locale}>
            <LocaleDisplay />
          </LocaleProvider>
        )

        expect(getByTestId('add-to-cart').textContent).toBe(
          dict.product.addToCart
        )

        cleanup()
      }),
      { numRuns: 100 }
    )
  })
})
