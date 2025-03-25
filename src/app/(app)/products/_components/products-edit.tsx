'use client'

import { notFound } from 'next/navigation'
import { getProduct } from '@/core/actions/product'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ProductsForm } from './products-form'

export function ProductsEdit({ productId }: { productId: string }) {
  const { data: product } = useSuspenseQuery({
    queryKey: ['product-detail', { id: productId }],
    queryFn: () => getProduct(productId),
  })

  if (!product) {
    notFound()
  }

  return <ProductsForm product={product} />
}
