'use server'

import { api } from '@/lib/http'
import { redirect } from 'next/navigation'
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
import { getSessionToken } from '@/lib/session'
import { type User } from '../types'

const AUTH_USER_TAG = 'auth-user'

export async function getUser(sessionToken: string): Promise<User> {
  'use cache'
  cacheLife('hours')
  cacheTag(AUTH_USER_TAG)

  const {
    data: { data: user },
  } = await api
    .get<{
      data: User
    }>('/auth/user', { sessionToken })
    .catch(() => {
      return { data: { data: null } }
    })

  if (!user) {
    redirect('/login')
  }

  if (user.email_verified_at === null) {
    redirect('/verify-email')
  }

  return user
}

export async function updateUser(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse<User>> {
  const sessionToken = await getSessionToken()
  const name = formData.get('name')

  try {
    const {
      status,
      data: { data: user },
    } = await api.put<{
      data: User
    }>('/auth/user', { name }, { sessionToken })

    revalidateTag(AUTH_USER_TAG)

    return handleActionSuccess(status, user)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

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

export async function sendEmailChangeVerificationNotification(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse<object>> {
  const sessionToken = await getSessionToken()
  const email = formData.get('email')

  try {
    const { status } = await api.post(
      '/auth/user/email/new/notification',
      { email },
      { sessionToken },
    )

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error, formData)
  }
}
