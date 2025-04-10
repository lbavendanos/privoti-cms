import { filled } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getProductCategories } from '../actions/product-category'

export function useProductCategories(params: Record<string, string> = {}) {
  const { data, isLoading } = useQuery({
    queryKey: filled(params)
      ? ['product-category-list', params]
      : ['product-category-list'],
    queryFn: () => getProductCategories(params),
  })

  return { data, isLoading }
}
