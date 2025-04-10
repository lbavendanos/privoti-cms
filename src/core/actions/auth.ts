'use server'

import { api } from '@/lib/http'
import { revalidateTag } from 'next/cache'
import { getSessionToken } from '@/lib/session'
import { handleActionError, handleActionSuccess } from '@/lib/action'
import type { ActionResponse } from '@/lib/action'

const AUTH_USER_TAG = 'auth-user'

export async function updatePassword(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse<object>> {
  const sessionToken = await getSessionToken()
  const currentPassword = formData.get('current_password')
  const password = formData.get('password')

  try {
    const { status } = await api.post(
      '/auth/user/password',
      { current_password: currentPassword, password },
      { sessionToken: sessionToken },
    )

    revalidateTag(AUTH_USER_TAG)

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
