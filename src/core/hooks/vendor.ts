import { core } from '@/lib/fetcher'
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { List, Vendor } from '../types'
import type { UseQueryOptions } from '@tanstack/react-query'

export function makeVendorsQueryOptions(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Vendor>>, 'queryKey' | 'queryFn'>,
) {
  return queryOptions({
    queryKey: ['vendor-list', params],
    queryFn: () => core.fetch<List<Vendor>>('/api/c/vendors', { params }),
    ...options,
  })
}

export function useVendors(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Vendor>>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(makeVendorsQueryOptions(params, options))
}

export function useVendorsSuspense(
  params: Record<string, unknown> = {},
  options?: Omit<UseQueryOptions<List<Vendor>>, 'queryKey' | 'queryFn'>,
) {
  return useSuspenseQuery(makeVendorsQueryOptions(params, options))
}
