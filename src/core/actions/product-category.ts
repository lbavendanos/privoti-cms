'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type ProductCategory } from '../types'

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
}

const ALL_PRODUCT_CATEGORIES_TAG = 'all-product-categories'

export async function getAllProductCategories(
  token: string,
): Promise<ProductCategory[]> {
  'use cache'
  cacheTag(ALL_PRODUCT_CATEGORIES_TAG)

  try {
    const {
      data: { data: categories },
    } = await api.get<{ data: ProductCategory[] }>('/categories', {
      params: { all: '1' },
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    return categories
  } catch {
    return []
  }
}
