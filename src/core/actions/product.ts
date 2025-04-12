'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import { handleActionError, handleActionSuccess } from '@/lib/action'
import type { List, Product } from '../types'
import type { ActionResponse } from '@/lib/action'

export async function getProducts(
  params: Record<string, string> = {},
): Promise<List<Product>> {
  const sessionToken = await getSessionToken()

  const { data } = await api.get<List<Product>>('/products', {
    params,
    sessionToken,
  })

  return data
}

export async function getProduct(id: number | string): Promise<Product | null> {
  const sessionToken = await getSessionToken()

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
    return handleActionError(error)
  }
}

export async function updateProduct(
  id: number | string,
  data: object | FormData,
): Promise<ActionResponse<Product>> {
  const sessionToken = await getSessionToken()
  const params = { _method: 'PUT' }

  try {
    const {
      status: responseStatus,
      data: { data: responseData },
    } = await api.post<{
      data: Product
    }>(`/products/${id}`, data, { params, sessionToken })

    return handleActionSuccess(responseStatus, responseData)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProduct(
  id: number | string,
): Promise<ActionResponse<unknown>> {
  const sessionToken = await getSessionToken()

  try {
    const { status } = await api.delete(`/products/${id}`, {}, { sessionToken })

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProducts(
  ids: number[] | string[],
): Promise<ActionResponse<unknown>> {
  const sessionToken = await getSessionToken()

  try {
    const { status } = await api.delete('/products', { ids }, { sessionToken })

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}
