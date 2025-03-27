'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import type { List, Meta, Product } from '../types'

export async function getProducts(
  params: Record<string, string> = {},
): Promise<List<Product>> {
  const sessionToken = await getSessionToken()

  console.info('Fetching products')

  try {
    const { data } = await api.get<List<Product>>('/products', {
      params,
      sessionToken,
    })

    return data
  } catch {
    return { data: [], meta: {} as Meta } as List<Product>
  }
}

export async function getProduct(id: number | string): Promise<Product | null> {
  const sessionToken = await getSessionToken()

  console.info('Fetching product', id)

  try {
    const {
      data: { data },
    } = await api.get<{ data: Product }>(`/products/${id}`, { sessionToken })

    return data
  } catch {
    return null
  }
}

export async function createProduct(
  formData: FormData,
): Promise<ActionResponse<Product>> {
  const sessionToken = await getSessionToken()

  try {
    const {
      status,
      data: { data },
    } = await api.post<{
      data: Product
    }>('/products', formData, { sessionToken })

    return handleActionSuccess(status, data)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function updateProduct(
  id: number | string,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  const sessionToken = await getSessionToken()
  const params = { _method: 'PUT' }

  try {
    const {
      status,
      data: { data },
    } = await api.post<{
      data: Product
    }>(`/products/${id}`, formData, { params, sessionToken })

    return handleActionSuccess(status, data)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
