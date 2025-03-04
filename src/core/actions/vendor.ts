'use server'

import { api } from '@/lib/http'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { type Vendor } from '../types'

const ALL_VENDORS_TAG = 'all-vendors'

export async function getAllVendors(token: string): Promise<Vendor[]> {
  'use cache'
  cacheTag(ALL_VENDORS_TAG)

  try {
    const {
      data: { data },
    } = await api.get<{ data: Vendor[] }>('/vendors', {
      params: { all: '1' },
      token,
    })

    return data
  } catch {
    return []
  }
}
