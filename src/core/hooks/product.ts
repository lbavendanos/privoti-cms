import { filled } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getProduct, getProducts } from '../actions/product'

export function useProducts(params: Record<string, string> = {}) {
  const { data } = useSuspenseQuery({
    queryKey: filled(params) ? ['product-list', params] : ['product-list'],
    queryFn: () => getProducts(params),
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
