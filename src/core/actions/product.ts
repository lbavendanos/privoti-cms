'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import { type Product } from '../types'

export async function getProduct(id: number): Promise<Product | null> {
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
      data: { data: product },
    } = await api.post<{
      data: Product
    }>('/products', formData, { sessionToken })

    return handleActionSuccess(status, product)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function updateProduct(
  id: number,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  const sessionToken = await getSessionToken()
  const params = { _method: 'PUT' }

  try {
    const {
      status,
      data: { data: product },
    } = await api.post<{
      data: Product
    }>(`/products/${id}`, formData, { params, sessionToken })

    return handleActionSuccess(status, product)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
