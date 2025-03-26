import { filled } from '@/lib/utils'
import { getProducts } from '@/core/actions/product'
import { getQueryClient } from '@/lib/query'
import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Products } from './_components/products'

export const metadata: Metadata = {
  title: 'Products',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
  const params = await searchParams
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => getProducts(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Products />
    </HydrationBoundary>
  )
}
