import { notFound } from 'next/navigation'
import { getProduct } from '../actions/product'
import { useSuspenseQuery } from '@tanstack/react-query'

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
