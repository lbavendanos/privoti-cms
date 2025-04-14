'use server'

import { core } from '@/lib/fetcher/core'
import type { List, ProductCategory } from '../types'

export async function getProductCategories(
  params: Record<string, string> = {},
): Promise<List<ProductCategory>> {
  return core.fetch<List<ProductCategory>>('/categories', { params })
}
