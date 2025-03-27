'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Meta, ProductCategory } from '../types'

export async function getProductCategories(
  params: Record<string, string> = {},
): Promise<List<ProductCategory>> {
  const sessionToken = await getSessionToken()

  try {
    const { data } = await api.get<List<ProductCategory>>('/categories', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return { data: [], meta: {} as Meta } as List<ProductCategory>
  }
}
