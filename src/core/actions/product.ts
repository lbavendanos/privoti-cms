'use server'

import { api } from '@/lib/http'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'

export async function createProduct(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const values = Object.fromEntries(formData.entries())

  console.log('Creating product with values:', values)

  try {
    const response = await api.post<{
      message?: string
    }>('/products', formData)

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
