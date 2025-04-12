import { notFound } from 'next/navigation'
import { fetcher, filled } from '@/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { List, Product } from '../types'

export function useProducts(params: Record<string, string> = {}) {
  const { data } = useSuspenseQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => fetcher<List<Product>>('/api/products', { params }),
  })

  return { data }
}

export function useProduct(id: string) {
  const { data: product } = useSuspenseQuery({
    queryKey: ['product-detail', { id }],
    queryFn: () => fetcher<Product>(`/api/products/${id}`),
  })

  if (!product) {
    notFound()
  }

  return { product }
}
