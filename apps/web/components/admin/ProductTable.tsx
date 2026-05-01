import type { Product } from '../../lib/types'

interface ProductTableProps {
  products: Product[]
  labels: {
    id: string
    name: string
    price: string
    stock: string
    actions: string
  }
}

export function ProductTable({ products, labels }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">{labels.id}</th>
            <th className="px-4 py-3 text-left">{labels.name}</th>
            <th className="px-4 py-3 text-right">{labels.price}</th>
            <th className="px-4 py-3 text-right">{labels.stock}</th>
            <th className="px-4 py-3 text-center">{labels.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {products.map((product) => (
            <tr key={product.id} className="bg-surface hover:bg-neutral-50" data-testid="product-row">
              <td className="px-4 py-3 text-neutral-500">{product.id}</td>
              <td className="px-4 py-3 font-medium text-neutral-900">{product.name}</td>
              <td className="px-4 py-3 text-right">¥{product.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">{product.stock}</td>
              <td className="px-4 py-3 text-center text-neutral-400">—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
