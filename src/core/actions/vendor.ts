'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import type { List, Meta, Vendor } from '../types'

export async function getVendors(
  params: Record<string, string> = {},
): Promise<List<Vendor>> {
  const sessionToken = await getSessionToken()

  try {
    const { data } = await api.get<List<Vendor>>('/vendors', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return { data: [], meta: {} as Meta } as List<Vendor>
  }
}
