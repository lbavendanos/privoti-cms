'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type Collection } from '../types'

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
}

const ALL_COLLECTIONS_TAG = 'all-collections'

export async function getAllCollections(token: string): Promise<Collection[]> {
  'use cache'
  cacheTag(ALL_COLLECTIONS_TAG)

  try {
    const {
      data: { data: types },
    } = await api.get<{ data: Collection[] }>('/collections', {
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
