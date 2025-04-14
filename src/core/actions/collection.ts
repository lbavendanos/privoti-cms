'use server'

import { core } from '@/lib/fetcher/core'
import type { List, Collection } from '../types'

export async function getCollections(
  params: Record<string, string> = {},
): Promise<List<Collection>> {
  return core.fetch<{ data: Collection[] }>('/collections', {
    params,
  })
}
