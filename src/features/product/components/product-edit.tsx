import { getRouteApi } from '@tanstack/react-router'
import { useProduct, useUpdateProduct } from '@/core/hooks/product'
import { ProductForm } from './product-form'

const route = getRouteApi('/_authenticated/(app)/products/$productId')

export function ProductEdit() {
  const { productId } = route.useParams()
  const { data: product } = useProduct(productId)
  const mutation = useUpdateProduct(`${product.id}`)

  return <ProductForm product={product} mutation={mutation} />
}
