'use server'

import { api } from '@/lib/http'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import {
  type SessionData,
  getSessionToken,
  removeSession,
  setSession,
} from '@/lib/session'

type ActionResponse = {
  status?: number
  message?: string
  errors?: Record<string, []>
  payload?: FormData
}

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

export const me = cache(async () => {
  const token = await getSessionToken()

  const {
    data: { data: user },
  } = await api
    .get<{
      data: User
    }>('/auth/user', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(() => {
      return { data: { data: null } }
    })

  if (!user) {
    redirect('/login')
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
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    if (authTokenData) {
      await setSession(authTokenData)
    }
  } catch (error: any) {
    return {
      status: error?.status,
      message: error?.data?.message,
      errors: error?.data?.errors || [],
      payload: formData,
    }
  }

  redirect('/')
}

export async function logout() {
  const token = await getSessionToken()

  await api
    .post('/auth/logout', null, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
      message: string
    }>(
      '/auth/forgot-password',
      { email },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    return {
      status: response.status,
      message: response.data.message,
    }
  } catch (error: any) {
    return {
      status: error?.status,
      message: error?.data?.message,
      errors: error?.data?.errors || [],
      payload: formData,
    }
  }
}
