'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, ProductType } from '../types'

export async function getProductTypes(
  params: Record<string, string> = {},
): Promise<List<ProductType>> {
  const sessionToken = await getSessionToken()

  const { data } = await api.get<List<ProductType>>('/types', {
    params,
    sessionToken,
  })

  return data
}
