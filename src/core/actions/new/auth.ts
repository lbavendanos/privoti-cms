'use server'

import { api } from '@/lib/http'
import { getSessionToken, setSession } from '@/lib/session'
import { handleActionError, handleActionSuccess } from '@/lib/new/action'
import type { User } from '@/core/types'
import type { SessionData } from '@/lib/session'
import type { ActionResponse } from '@/lib/new/action'

export async function getUser(): Promise<User | null> {
  const sessionToken = await getSessionToken()

  const {
    data: { data: user },
  } = await api
    .get<{
      data: User
    }>('/auth/user', { sessionToken })
    .catch(() => {
      return { data: { data: null } }
    })

  return user
}

export async function login(data: {
  email: string
  password: string
}): Promise<ActionResponse<null>> {
  const { email, password } = data

  try {
    const {
      status,
      data: { data: sessionData },
    } = await api.post<{
      data: SessionData
    }>('/auth/login', { email, password })

    await setSession(sessionData)

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}
