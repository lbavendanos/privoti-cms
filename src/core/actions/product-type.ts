'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type ProductType } from '../types'

const ALL_PRODUCT_TYPES_TAG = 'all-product-types'

export async function getAllProductTypes(
  token: string,
): Promise<ProductType[]> {
  'use cache'
  cacheTag(ALL_PRODUCT_TYPES_TAG)

  try {
    const {
      data: { data },
    } = await api.get<{ data: ProductType[] }>('/types', {
      params: { all: '1' },
      token,
    })

    return data
  } catch {
    return []
  }
}
