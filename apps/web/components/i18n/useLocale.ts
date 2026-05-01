'use client'

import { useContext } from 'react'
import { LocaleContext } from './LocaleProvider'
import type { Locale } from '../../lib/types'
import type { Messages } from '../../lib/i18n/en'

type UseLocaleReturn = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
}

export function useLocale(): UseLocaleReturn {
  return useContext(LocaleContext)
}
