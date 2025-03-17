'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { type ProductCategory } from '../types'

export async function getProductCategories(
  params: Record<string, string> = {},
) {
  const sessionToken = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: ProductCategory[] }>('/categories', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return []
  }
}
