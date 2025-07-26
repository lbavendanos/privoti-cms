import { useSuspenseQueries } from '@tanstack/react-query'
import { makeVendorsQueryOptions } from '@/core/hooks/vendor'
import { makeProductsQueryOptions } from '@/core/hooks/product'
import { makeProductTypesQueryOptions } from '@/core/hooks/product-type'
import type { ProductSearchSchema } from '../schemas/product-search-schema'

type UseProductListProps = {
  searchParams: Partial<ProductSearchSchema>
}

export function useProductList({ searchParams }: UseProductListProps) {
  const [
    {
      data: {
        data: products,
        meta: { total: productCount },
      },
    },
    {
      data: { data: productTypes },
    },
    {
      data: { data: vendors },
    },
  ] = useSuspenseQueries({
    queries: [
      makeProductsQueryOptions(searchParams),
      makeProductTypesQueryOptions({ per_page: 1000 }),
      makeVendorsQueryOptions({ per_page: 1000 }),
    ],
  })

  return {
    products,
    productCount,
    productTypes,
    vendors,
  }
}
