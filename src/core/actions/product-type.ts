'use server'

import { core } from '@/lib/fetcher/core'
import type { List, ProductType } from '../types'

export async function getProductTypes(
  params: Record<string, string> = {},
): Promise<List<ProductType>> {
  return core.fetch<List<ProductType>>('/types', { params })
}
