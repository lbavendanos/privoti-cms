import { cache } from 'react'
import { dehydrate } from '@tanstack/react-query'
import { getProduct } from '@/core/actions/product'
import { getQueryClient } from '@/lib/query'
import type { Metadata } from 'next'
import { ProductsEdit } from '../_components/products-edit'
import { HydrationBoundary } from '@tanstack/react-query'

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
  const { id } = await params
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['product-detail', { id }],
    queryFn: () => getProductCached(id),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsEdit productId={id} />
    </HydrationBoundary>
  )
}
