'use client'

import { createContext, useState, type ReactNode } from 'react'
import type { Locale } from '../../lib/types'
import { en } from '../../lib/i18n/en'
import { ja } from '../../lib/i18n/ja'
import type { Messages } from '../../lib/i18n/en'

const dictionaries: Record<Locale, Messages> = { en, ja }

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ja',
  setLocale: () => {},
  messages: ja,
})

export function LocaleProvider({
  children,
  defaultLocale = 'ja',
}: {
  children: ReactNode
  defaultLocale?: Locale
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, messages: dictionaries[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  )
}
