'use server'

import { core } from '@/lib/fetcher/core'
import { errorResponse, successResponse } from '@/lib/action'
import type { List, Product } from '../types'
import type { ActionResponse } from '@/lib/action'

export async function getProducts(
  params: Record<string, string> = {},
): Promise<List<Product>> {
  return core.fetch<List<Product>>('/products', { params })
}

export async function getProduct(id: number | string): Promise<Product | null> {
  try {
    const { data: product } = await core.fetch<{ data: Product }>(
      `/products/${id}`,
    )

    return product
  } catch {
    return null
  }
}

export async function createProduct(
  payload: FormData,
): Promise<ActionResponse<Product | null>> {
  try {
    const { data: product } = await core.fetch<{
      data: Product
    }>('/products', { method: 'POST', body: payload })

    return successResponse(product)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updateProduct(
  id: number | string,
  payload: Record<string, string> | FormData,
): Promise<ActionResponse<Product | null>> {
  const params = { _method: 'PUT' }

  try {
    const { data: product } = await core.fetch<{
      data: Product
    }>(`/products/${id}`, {
      method: 'POST',
      body: payload,
      params,
    })

    return successResponse(product)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function deleteProduct(
  id: number | string,
): Promise<ActionResponse<null>> {
  try {
    await core.fetch(`/products/${id}`, { method: 'DELETE' })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function deleteProducts(
  ids: number[] | string[],
): Promise<ActionResponse<null>> {
  try {
    await core.fetch('/products', {
      method: 'DELETE',
      body: { ids } as unknown as BodyInit,
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
