'use server'

import { api } from '@/lib/http'
import { type Product } from '../types'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import { getSessionToken } from '@/lib/session'

export async function createProduct(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse<Product>> {
  const token = await getSessionToken()

  try {
    const {
      status,
      data: { data: product },
    } = await api.post<{
      data: Product
    }>('/products', formData, { token })

    return handleActionSuccess(status, product)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
