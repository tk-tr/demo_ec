import { getProduct } from '../../../lib/api'
import { ProductDetailWrapper } from '../../../components/product/ProductDetailWrapper'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(Number(id))
  return <ProductDetailWrapper product={product} />
}
