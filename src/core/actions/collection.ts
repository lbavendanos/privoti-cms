'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { type Collection } from '../types'

export async function getCollections(
  params: Record<string, string> = {},
): Promise<Collection[]> {
  const token = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: Collection[] }>('/collections', {
      params,
      token,
    })

    return data
  } catch {
    return []
  }
}
