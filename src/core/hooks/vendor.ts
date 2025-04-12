import { useQuery } from '@tanstack/react-query'
import { fetcher, filled } from '@/lib/utils'
import type { List, Vendor } from '../types'
import type { UseQueryOptions } from '@tanstack/react-query'

export function useVendors(
  params: Record<string, string> = {},
  options?: Omit<UseQueryOptions<List<Vendor>>, 'queryKey' | 'queryFn'>,
) {
  const { data, isFetching } = useQuery({
    queryKey: filled(params) ? ['vendor-list', params] : ['vendor-list'],
    queryFn: () => fetcher<List<Vendor>>('/api/vendors', { params }),
    ...options,
  })

  return { data, isFetching }
}
