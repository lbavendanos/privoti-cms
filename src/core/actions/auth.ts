'use server'

import { api } from '@/lib/http'
import { redirect } from 'next/navigation'
import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache'
import {
  type ActionResponse,
  handleActionError,
  handleActionSuccess,
} from '@/lib/action'
import {
  type SessionData,
  getSessionToken,
  removeSession,
  setSession,
} from '@/lib/session'
import { type User } from '../types'

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const TAG_AUTH_USER = 'auth-user'

export async function getUser(token: string) {
  'use cache'
  cacheTag(TAG_AUTH_USER)

  const {
    data: { data: user },
  } = await api
    .get<{
      data: User
    }>('/auth/user', {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })
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
): Promise<ActionResponse> {
  const token = await getSessionToken()
  const name = formData.get('name')

  try {
    const response = await api.put<{
      data: User
    }>(
      '/auth/user',
      { name },
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    revalidateTag(TAG_AUTH_USER)

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function updatePassword(_: unknown, formData: FormData) {
  const token = await getSessionToken()
  const currentPassword = formData.get('current_password')
  const password = formData.get('password')

  try {
    const response = await api.post<{
      message?: string
    }>(
      '/auth/user/password',
      { current_password: currentPassword, password },
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    revalidateTag(TAG_AUTH_USER)

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function login(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const {
      data: { data: authTokenData },
    } = await api.post<{
      data: SessionData
    }>(
      '/auth/login',
      { email, password },
      {
        headers: DEFAULT_HEADERS,
      },
    )

    if (authTokenData) {
      await setSession(authTokenData)

      revalidateTag(TAG_AUTH_USER)
    }
  } catch (error) {
    return handleActionError(error, formData)
  }

  redirect('/')
}

export async function logout() {
  const token = await getSessionToken()

  await api
    .post(
      '/auth/logout',
      {},
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .catch(() => {})

  await removeSession()

  revalidateTag(TAG_AUTH_USER)

  redirect('/login')
}

export async function forgotPassword(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const email = formData.get('email')

  try {
    const response = await api.post<{
      message?: string
    }>(
      '/auth/forgot-password',
      { email },
      {
        headers: DEFAULT_HEADERS,
      },
    )

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function resetPassword(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const token = formData.get('token')
  const email = formData.get('email')
  const password = formData.get('password')
  const passwordConfirmation = formData.get('password_confirmation')

  try {
    const {
      data: { data: authTokenData },
    } = await api.post<{
      data: SessionData
    }>(
      '/auth/reset-password',
      { token, email, password, password_confirmation: passwordConfirmation },
      {
        headers: DEFAULT_HEADERS,
      },
    )

    if (authTokenData) {
      await setSession(authTokenData)
    }
  } catch (error) {
    return handleActionError(error, formData)
  }

  redirect('/')
}

export async function sendEmailVerificationNotification(): Promise<ActionResponse> {
  const token = await getSessionToken()

  try {
    const response = await api.post<{
      message?: string
    }>(
      '/auth/user/email/notification',
      {},
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function verifyEmail(params: {
  id: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse> {
  const token = await getSessionToken()
  const { id, token: hash, expires, signature } = params

  try {
    const response = await api.get<{
      message?: string
    }>(`/auth/user/email/verify/${id}/${hash}`, {
      params: { expires, signature },
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    revalidateTag(TAG_AUTH_USER)

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function sendEmailChangeVerificationNotification(
  _: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  const token = await getSessionToken()
  const email = formData.get('email')

  try {
    const response = await api.post<{
      message?: string
    }>(
      '/auth/user/email/new/notification',
      { email },
      {
        headers: {
          ...DEFAULT_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error, formData)
  }
}

export async function verifyNewEmail(params: {
  id: string
  email: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse> {
  const token = await getSessionToken()
  const { id, email, token: hash, expires, signature } = params

  try {
    const response = await api.get<{
      message?: string
    }>(`/auth/user/email/new/verify/${id}/${email}/${hash}`, {
      params: { expires, signature },
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    revalidateTag(TAG_AUTH_USER)

    return handleActionSuccess(response)
  } catch (error) {
    return handleActionError(error)
  }
}
