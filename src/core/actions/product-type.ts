'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { type ProductType } from '../types'

export async function getProductTypes(
  params: Record<string, string> = {},
): Promise<ProductType[]> {
  const token = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: ProductType[] }>('/types', {
      params,
      token,
    })

    return data
  } catch {
    return []
  }
}
