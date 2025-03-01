'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type ProductType } from '../types'

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
}

const ALL_PRODUCT_TYPES_TAG = 'all-product-types'

export async function getAllProductTypes(
  token: string,
): Promise<ProductType[]> {
  'use cache'
  cacheTag(ALL_PRODUCT_TYPES_TAG)

  try {
    const {
      data: { data: types },
    } = await api.get<{ data: ProductType[] }>('/types', {
      params: { all: '1' },
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    return types
  } catch {
    return []
  }
}
