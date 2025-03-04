'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type Collection } from '../types'

const ALL_COLLECTIONS_TAG = 'all-collections'

export async function getAllCollections(token: string): Promise<Collection[]> {
  'use cache'
  cacheTag(ALL_COLLECTIONS_TAG)

  try {
    const {
      data: { data },
    } = await api.get<{ data: Collection[] }>('/collections', {
      params: { all: '1' },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch {
    return []
  }
}

export async function getCollections(
  params: Record<string, string> = {},
): Promise<Collection[]> {
  const token = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: Collection[] }>('/collections', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch {
    return []
  }
}
