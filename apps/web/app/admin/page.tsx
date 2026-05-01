'use client'

import { useState, type FormEvent } from 'react'
import { adminRequest } from '../../lib/api'
import type { Order, Product } from '../../lib/types'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { ProductTable } from '../../components/admin/ProductTable'
import { OrderTable } from '../../components/admin/OrderTable'
import { Toast } from '../../components/ui/Toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useLocale } from '../../components/i18n/useLocale'

type Section = 'products' | 'orders'

export default function AdminPage() {
  const { messages } = useLocale()
  const t = messages.admin

  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('password')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [activeSection, setActiveSection] = useState<Section>('products')
  const [toast, setToast] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)
  const [authError, setAuthError] = useState('')
  const [loadingData, setLoadingData] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0 })
  const [submitting, setSubmitting] = useState(false)

  const auth = { user, pass }

  const showToast = (message: string, variant: 'success' | 'error') => {
    setToast({ message, variant })
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = async () => {
    setLoadingData(true)
    setAuthError('')
    try {
      const [productList, orderList] = await Promise.all([
        adminRequest('/admin/products', auth),
        adminRequest('/admin/orders', auth),
      ])
      setProducts(productList)
      setOrders(orderList)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      if (/unauth|401|forbidden/i.test(msg)) {
        setAuthError(t.authError)
      } else {
        setAuthError(msg)
      }
    } finally {
      setLoadingData(false)
    }
  }

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminRequest('/admin/products', auth, {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm({ name: '', description: '', price: 0, stock: 0 })
      await loadData()
      showToast(t.productAdded, 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t.title}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          labels={{ products: t.products, orders: t.orders }}
        />

        <div className="flex-1 flex flex-col gap-6">
          {/* Auth */}
          <div className="bg-surface rounded-lg border border-neutral-200 p-4 flex flex-wrap gap-3 items-end">
            <Input
              label="User"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-36"
            />
            <Input
              label="Password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-36"
            />
            <Button variant="secondary" onClick={loadData} loading={loadingData}>
              Load Data
            </Button>
            {authError && (
              <p role="alert" className="text-sm text-red-600 w-full">
                {authError}
              </p>
            )}
          </div>

          {/* Add product form */}
          {activeSection === 'products' && (
            <form
              onSubmit={handleCreateProduct}
              className="bg-surface rounded-lg border border-neutral-200 p-4 flex flex-col gap-3"
            >
              <h2 className="font-semibold">{t.addProduct}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={t.name}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  disabled={submitting}
                />
                <Input
                  label={t.price}
                  type="number"
                  value={String(form.price)}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  required
                  disabled={submitting}
                />
                <Input
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  disabled={submitting}
                />
                <Input
                  label={t.stock}
                  type="number"
                  value={String(form.stock)}
                  onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                  required
                  disabled={submitting}
                />
              </div>
              <Button type="submit" loading={submitting} className="self-start">
                {t.addProduct}
              </Button>
            </form>
          )}

          {/* Tables */}
          {activeSection === 'products' && (
            <ProductTable
              products={products}
              labels={{
                id: t.id,
                name: t.name,
                price: t.price,
                stock: t.stock,
                actions: t.actions,
              }}
            />
          )}
          {activeSection === 'orders' && (
            <OrderTable
              orders={orders}
              labels={{
                orderId: t.orderId,
                customer: t.customer,
                price: t.price,
                status: t.status,
                paymentStatus: t.paymentStatus,
              }}
            />
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
