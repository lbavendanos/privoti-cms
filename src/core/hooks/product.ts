import { filled } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getProduct, getProducts } from '../actions/product'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

export function useProducts(
  params: Record<string, string> = {},
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getProducts>>>,
    'queryKey' | 'queryFn'
  >,
) {
  const { data } = useQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => getProducts(params),
    ...options,
  })

  return { data }
}

export function useProduct(id: string) {
  const { data: product } = useSuspenseQuery({
    queryKey: ['product-detail', { id }],
    queryFn: () => getProduct(id),
  })

  if (!product) {
    notFound()
  }

  return { product }
}
