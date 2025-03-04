'use server'

import { api } from '@/lib/http'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import { getSessionToken } from '@/lib/session'

export async function createProduct(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getSessionToken()

  try {
    const response = await api.post<{
      message?: string
    }>('/products', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
