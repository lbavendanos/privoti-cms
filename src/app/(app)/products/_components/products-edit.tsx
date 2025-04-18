'use client'

import { useProduct } from '@/core/hooks/product'
import { ProductsForm } from './products-form'

export function ProductsEdit({ productId }: { productId: string }) {
  const { product } = useProduct(productId)

  return <ProductsForm product={product} />
}
