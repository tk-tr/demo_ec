import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'error' | 'warning' | 'neutral'

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  neutral: 'bg-neutral-100 text-neutral-700',
}

export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className ?? ''}`}
    >
      {children}
    </span>
  )
}
