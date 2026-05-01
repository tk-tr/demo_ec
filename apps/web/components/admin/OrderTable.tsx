import type { Order } from '../../lib/types'

interface OrderTableProps {
  orders: Order[]
  labels: {
    orderId: string
    customer: string
    price: string
    status: string
    paymentStatus: string
  }
}

export function OrderTable({ orders, labels }: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">{labels.orderId}</th>
            <th className="px-4 py-3 text-left">{labels.customer}</th>
            <th className="px-4 py-3 text-right">{labels.price}</th>
            <th className="px-4 py-3 text-left">{labels.status}</th>
            <th className="px-4 py-3 text-left">{labels.paymentStatus}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {orders.map((order) => (
            <tr key={order.id} className="bg-surface hover:bg-neutral-50" data-testid="order-row">
              <td className="px-4 py-3 text-neutral-500">#{order.id}</td>
              <td className="px-4 py-3 font-medium text-neutral-900">{order.customerName}</td>
              <td className="px-4 py-3 text-right">¥{order.total.toLocaleString()}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3">{order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
