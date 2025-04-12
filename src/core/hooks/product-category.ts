import { useQuery } from '@tanstack/react-query'
import { fetcher, filled } from '@/lib/utils'
import type { List, ProductCategory } from '../types'

export function useProductCategories(params: Record<string, string> = {}) {
  const { data, isLoading } = useQuery({
    queryKey: filled(params)
      ? ['product-category-list', params]
      : ['product-category-list'],
    queryFn: () =>
      fetcher<List<ProductCategory>>('/api/products/categories', { params }),
  })

  return { data, isLoading }
}
