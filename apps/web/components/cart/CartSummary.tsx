import Link from 'next/link'
import type { CartItemWithProduct } from '../../lib/types'

interface CartSummaryProps {
  items: CartItemWithProduct[]
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Subtotal</span>
        <span data-testid="subtotal">¥{subtotal.toLocaleString()}</span>
      </div>

      <Link
        href="/checkout"
        className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-md font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent w-full text-center"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}
