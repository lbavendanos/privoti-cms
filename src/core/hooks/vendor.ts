import { filled } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getVendors } from '../actions/vendor'
import type { UseQueryOptions } from '@tanstack/react-query'

export function useVendors(
  params: Record<string, string> = {},
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getVendors>>>,
    'queryKey' | 'queryFn'
  >,
) {
  const { data, isFetching } = useQuery({
    queryKey: filled(params) ? ['vendor-list', params] : ['vendor-list'],
    queryFn: () => getVendors(params),
    ...options,
  })
  return { data, isFetching }
}
