'use client'

type Section = 'products' | 'orders'

interface AdminSidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  labels: { products: string; orders: string }
}

export function AdminSidebar({ activeSection, onSectionChange, labels }: AdminSidebarProps) {
  const items: { key: Section; label: string }[] = [
    { key: 'products', label: labels.products },
    { key: 'orders', label: labels.orders },
  ]

  const activeClass = 'bg-primary text-primary-foreground font-semibold'
  const inactiveClass = 'text-neutral-700 hover:bg-neutral-100'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-48 shrink-0 gap-1">
        {items.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={`text-left px-4 py-3 rounded-md text-sm min-h-[44px] transition-colors ${
              activeSection === key ? activeClass : inactiveClass
            }`}
            aria-current={activeSection === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </aside>

      {/* Mobile tab bar */}
      <div className="flex lg:hidden border-b border-neutral-200 mb-4">
        {items.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
              activeSection === key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
            aria-current={activeSection === key ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  )
}
