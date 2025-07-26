import { core } from '@/lib/fetcher'
import { useQuery } from '@tanstack/react-query'
import type { List, ProductCategory } from '../types'

export function useProductCategories(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['product-category-list', params],
    queryFn: () =>
      core.fetch<List<ProductCategory>>('/api/c/products/categories', {
        params,
      }),
  })
}
