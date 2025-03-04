'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type ProductCategory } from '../types'

const ALL_PRODUCT_CATEGORIES_TAG = 'all-product-categories'

export async function getAllProductCategories(
  token: string,
): Promise<ProductCategory[]> {
  'use cache'
  cacheTag(ALL_PRODUCT_CATEGORIES_TAG)

  try {
    const {
      data: { data },
    } = await api.get<{ data: ProductCategory[] }>('/categories', {
      params: { all: '1' },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch {
    return []
  }
}
