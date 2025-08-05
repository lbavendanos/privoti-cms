import { createFileRoute } from '@tanstack/react-router'
import { makeProductQueryOptions } from '@/core/hooks/product'
import { Loading } from '@/components/loading'
import { ProductDetail } from '@/features/product/components/product-detail'

export const Route = createFileRoute(
  '/_authenticated/(app)/products/$productId',
)({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData(makeProductQueryOptions(Number(productId)))
  },
  pendingComponent: Loading,
  component: ProductDetail,
})
