import { createFileRoute } from '@tanstack/react-router'
import { productSearchSchema } from '@/features/product/schemas/product-search-schema'
import { makeVendorsQueryOptions } from '@/core/hooks/vendor'
import { makeProductsQueryOptions } from '@/core/hooks/product'
import { makeProductTypesQueryOptions } from '@/core/hooks/product-type'
import { Loading } from '@/components/loading'
import { ProductList } from '@/features/product/components/product-list'

export const Route = createFileRoute('/_authenticated/(app)/products/')({
  validateSearch: productSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    queryClient.ensureQueryData(makeProductsQueryOptions(deps))
    queryClient.ensureQueryData(
      makeProductTypesQueryOptions({ per_page: 1000 }),
    )
    queryClient.ensureQueryData(makeVendorsQueryOptions({ per_page: 1000 }))
  },
  pendingComponent: Loading,
  component: ProductList,
})
