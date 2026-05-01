'use client'

import { useState, type FormEvent } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { createOrder } from '../../lib/api'
import { clearCart } from '../../lib/cart'
import type { CartItemWithProduct, CheckoutFormData, ValidationErrors } from '../../lib/types'
import { useLocale } from '../i18n/useLocale'

interface CheckoutFormProps {
  items: CartItemWithProduct[]
}

function validate(data: CheckoutFormData, msgs: ReturnType<typeof useLocale>['messages']): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!data.customerName.trim()) {
    errors.customerName = msgs.checkout.validation.nameRequired
  }
  if (!data.customerEmail.trim()) {
    errors.customerEmail = msgs.checkout.validation.emailRequired
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.customerEmail)) {
    errors.customerEmail = msgs.checkout.validation.emailInvalid
  }
  return errors
}

export function CheckoutForm({ items }: CheckoutFormProps) {
  const { messages } = useLocale()
  const t = messages.checkout
  const [form, setForm] = useState<CheckoutFormData>({ customerName: '', customerEmail: '' })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [apiError, setApiError] = useState('')

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors = validate(form, messages)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    setApiError('')
    try {
      const res = await createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      })
      clearCart()
      setOrderId(res.order.id)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : t.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (orderId !== null) {
    return (
      <div
        data-testid="success-message"
        className="bg-green-50 border border-green-500 rounded-lg p-6 text-green-800"
      >
        {t.successMessage.replace('#{orderId}', String(orderId))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Order summary */}
      <section data-testid="order-summary" className="bg-surface rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold mb-4">{t.orderSummary}</h2>
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 last:border-0">
            <span>{item.product.name} × {item.quantity}</span>
            <span>¥{(item.product.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold mt-4 pt-3 border-t border-neutral-200">
          <span>{t.orderTotal}</span>
          <span>¥{total.toLocaleString()}</span>
        </div>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold">{t.title}</h2>

        <Input
          id="customer-name"
          label={t.customerName}
          value={form.customerName}
          onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
          error={errors.customerName}
          required
          disabled={loading}
        />

        <Input
          id="customer-email"
          label={t.customerEmail}
          type="email"
          value={form.customerEmail}
          onChange={(e) => setForm((prev) => ({ ...prev, customerEmail: e.target.value }))}
          error={errors.customerEmail}
          required
          disabled={loading}
        />

        {apiError && (
          <p role="alert" className="text-sm text-red-600">
            {apiError}
          </p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? t.processing : t.placeOrder}
        </Button>
      </form>
    </div>
  )
}
