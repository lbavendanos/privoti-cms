import { getProducts } from '@/core/actions/product'
import { getQueryClient } from '@/lib/query'
import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Products } from './_components/products'

export const metadata: Metadata = {
  title: 'Products',
}

export default function ProductsPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ['product-list'],
    queryFn: () => getProducts(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Products />
    </HydrationBoundary>
  )
}
