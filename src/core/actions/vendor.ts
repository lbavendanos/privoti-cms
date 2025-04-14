'use server'

import { core } from '@/lib/fetcher/core'
import type { List, Vendor } from '../types'

export async function getVendors(
  params: Record<string, string> = {},
): Promise<List<Vendor>> {
  return core.fetch<List<Vendor>>('/vendors', { params })
}
