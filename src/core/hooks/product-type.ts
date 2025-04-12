import { fetcher, filled } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { List, ProductType } from '../types'

export function useProductTypes(
  params: Record<string, string> = {},
  options?: Omit<UseQueryOptions<List<ProductType>>, 'queryKey' | 'queryFn'>,
) {
  const { data, isFetching } = useQuery({
    queryKey: filled(params)
      ? ['product-type-list', params]
      : ['product-type-list'],
    queryFn: () =>
      fetcher<List<ProductType>>('/api/products/types', { params }),
    ...options,
  })

  return { data, isFetching }
}
