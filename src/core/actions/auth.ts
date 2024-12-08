'use server'

import { api } from '@/lib/http'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { type ActionResponse, handleActionError, handleActionSuccess } from '.'
import {
  type SessionData,
  getSessionToken,
  removeSession,
  setSession,
} from '@/lib/session'

export type User = {
  id: number
  first_name: string
  last_name: string
  full_name: string
  short_name: string
  initials: string
  email: string
  avatar?: string
  phone?: string
  dob?: string
  email_verified_at?: string
  updated_at?: string
  created_at?: string
}

const DEFAULT_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const me = cache(async () => {
  const token = await getSessionToken()

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
})

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
    }
  } catch (error: any) {
    return handleActionError(error, formData)
  }

  redirect('/')
}

export async function logout() {
  const token = await getSessionToken()

  await api
    .post('/auth/logout', null, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(() => {})

  await removeSession()

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
  } catch (error: any) {
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
  } catch (error: any) {
    return handleActionError(error, formData)
  }

  redirect('/')
}

export async function sendEmailVerificationNotification(): Promise<ActionResponse> {
  const token = await getSessionToken()

  try {
    const response = await api.post<{
      message?: string
    }>('/auth/user/email/notification', null, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    })

    return handleActionSuccess(response)
  } catch (error: any) {
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

    return handleActionSuccess(response)
  } catch (error: any) {
    return handleActionError(error)
  }
}
