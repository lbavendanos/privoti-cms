import { filled } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getProductTypes } from '../actions/product-type'
import type { UseQueryOptions } from '@tanstack/react-query'

export function useProductTypes(
  params: Record<string, string> = {},
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getProductTypes>>>,
    'queryKey' | 'queryFn'
  >,
) {
  const { data, isFetching } = useQuery({
    queryKey: filled(params)
      ? ['product-type-list', params]
      : ['product-type-list'],
    queryFn: () => getProductTypes(params),
    ...options,
  })

  return { data, isFetching }
}
