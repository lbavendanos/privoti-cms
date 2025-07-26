import { core } from '@/lib/fetcher'
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { List, ProductType } from '../types'

export function makeProductTypesQueryOptions(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<ProductType>>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['product-type-list', params],
    queryFn: () =>
      core.fetch<List<ProductType>>('/api/c/products/types', { params }),
    ...options,
  })
}

export function useProductTypes(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<ProductType>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(makeProductTypesQueryOptions(params, options))
}

export function useProductTypesSuspense(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<ProductType>>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery(makeProductTypesQueryOptions(params, options))
}
