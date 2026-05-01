import './globals.css'
import type { ReactNode } from 'react'
import { LocaleProvider } from '../components/i18n/LocaleProvider'
import { NavigationWrapper } from '../components/layout/NavigationWrapper'

export const metadata = {
  title: 'EC Store',
  description: 'Online shop',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <LocaleProvider defaultLocale="ja">
          <NavigationWrapper />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}
