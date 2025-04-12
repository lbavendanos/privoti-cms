'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Vendor } from '../types'

export async function getVendors(
  params: Record<string, string> = {},
): Promise<List<Vendor>> {
  const sessionToken = await getSessionToken()

  const { data } = await api.get<List<Vendor>>('/vendors', {
    params,
    sessionToken,
  })

  return data
}
