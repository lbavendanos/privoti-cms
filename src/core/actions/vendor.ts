'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type Vendor } from '../types'

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
}

const ALL_VENDORS_TAG = 'all-vendors'

export async function getAllVendors(token: string): Promise<Vendor[]> {
  'use cache'
  cacheTag(ALL_VENDORS_TAG)

  try {
    const {
      data: { data: types },
    } = await api.get<{ data: Vendor[] }>('/vendors', {
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
