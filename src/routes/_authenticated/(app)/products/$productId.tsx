import { createFileRoute } from '@tanstack/react-router'
import { makeProductQueryOptions } from '@/core/hooks/product'
import { Loading } from '@/components/loading'
import { ProductEdit } from '@/features/product/components/product-edit'

export const Route = createFileRoute(
  '/_authenticated/(app)/products/$productId',
)({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData(makeProductQueryOptions(productId))
  },
  pendingComponent: Loading,
  component: ProductEdit,
})
