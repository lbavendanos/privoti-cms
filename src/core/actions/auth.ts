'use server'

import { api } from '@/lib/http'
import { type SessionData, setSession } from '@/lib/session'
import { redirect } from 'next/navigation'

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
