'use server'

import { api } from '@/lib/http'
import { getSessionToken } from '@/lib/session'
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
  revalidateTag,
} from 'next/cache'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import { type Product } from '../types'

const PRODUCT_TAG = 'product'

export async function getProduct(
  id: number,
  sessionToken: string,
): Promise<Product | null> {
  'use cache'
  cacheLife('hours')

  try {
    const {
      data: { data },
    } = await api.get<{ data: Product }>(`/products/${id}`, { sessionToken })

    cacheTag(`${PRODUCT_TAG}_${data.id}`)

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

    revalidateTag(`${PRODUCT_TAG}_${data.id}`)

    return handleActionSuccess(status, data)
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
      data: { data },
    } = await api.post<{
      data: Product
    }>(`/products/${id}`, formData, { params, sessionToken })

    revalidateTag(`${PRODUCT_TAG}_${data.id}`)

    return handleActionSuccess(status, data)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
