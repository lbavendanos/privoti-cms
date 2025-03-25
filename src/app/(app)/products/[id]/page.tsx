import { cache } from 'react'
import { getProduct } from '@/core/actions/product'
import { getQueryClient } from '@/lib/query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { ProductsEdit } from '../_components/products-edit'

const getProductCached = cache(getProduct)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProductCached(id)

  return {
    title: product?.title,
  }
}

export default async function EidtProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: productId } = await params
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['product-detail', { id: productId }],
    queryFn: () => getProductCached(productId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsEdit productId={productId} />
    </HydrationBoundary>
  )
}
