'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Meta, ProductType } from '../types'

export async function getProductTypes(
  params: Record<string, string> = {},
): Promise<List<ProductType>> {
  const sessionToken = await getSessionToken()

  try {
    const { data } = await api.get<List<ProductType>>('/types', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return { data: [], meta: {} as Meta } as List<ProductType>
  }
}
