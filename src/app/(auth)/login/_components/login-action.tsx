'use server'

import { api } from '@/lib/http'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type AuthTokenData = {
  access_token: string
  token_type: string
  expires_in: number
}

type ActionResponse = {
  status?: number
  message?: string
  errors?: Record<string, []>
  payload?: FormData
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
      data: AuthTokenData
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
      await setAuthToken(authTokenData)
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

async function setAuthToken({ access_token, expires_in }: AuthTokenData) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME as string
  const key = `_${appName.toLowerCase()}_jwt`

  const cookieStore = await cookies()

  cookieStore.set(key, access_token, {
    maxAge: expires_in,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}
