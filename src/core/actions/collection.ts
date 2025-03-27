'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Collection, Meta } from '../types'

export async function getCollections(
  params: Record<string, string> = {},
): Promise<List<Collection>> {
  const sessionToken = await getSessionToken()

  try {
    const { data } = await api.get<{ data: Collection[] }>('/collections', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return { data: [], meta: {} as Meta } as List<Collection>
  }
}
