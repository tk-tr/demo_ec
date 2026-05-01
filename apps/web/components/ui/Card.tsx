import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-lg border border-neutral-200 p-4 shadow-sm ${className ?? ''}`}
      {...props}
    >
      {children}
    </div>
  )
}
