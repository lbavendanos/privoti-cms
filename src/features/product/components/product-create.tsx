import { useCreateProduct } from '@/core/hooks/product'
import { ProductForm } from './product-form'

export function ProductCreate() {
  const mutation = useCreateProduct()

  return <ProductForm mutation={mutation} />
}
