'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { type Vendor } from '../types'

export async function getVendors(
  params: Record<string, string> = {},
): Promise<Vendor[]> {
  const sessionToken = await getSessionToken()

  try {
    const {
      data: { data },
    } = await api.get<{ data: Vendor[] }>('/vendors', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return []
  }
}
