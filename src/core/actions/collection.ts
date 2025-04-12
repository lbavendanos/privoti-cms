'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Collection } from '../types'

export async function getCollections(
  params: Record<string, string> = {},
): Promise<List<Collection>> {
  const sessionToken = await getSessionToken()

  const { data } = await api.get<{ data: Collection[] }>('/collections', {
    params,
    sessionToken,
  })

  return data
}
