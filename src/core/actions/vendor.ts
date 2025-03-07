'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { type Vendor } from '../types'

export async function getVendors(
  params: Record<string, string> = {},
): Promise<Vendor[]> {
  const token = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: Vendor[] }>('/vendors', {
      params,
      token,
    })

    return data
  } catch {
    return []
  }
}
