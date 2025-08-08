import { getRouteApi } from '@tanstack/react-router'
import { useProduct, useUpdateProduct } from '@/core/hooks/product'
import { ProductForm } from './product-form'

const route = getRouteApi('/_authenticated/(app)/products/$productId')

export function ProductDetail() {
  const { productId } = route.useParams()
  const { data: product } = useProduct(Number(productId))

  return <ProductForm product={product} />
}
