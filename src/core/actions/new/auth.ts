'use server'

import { api } from '@/lib/http'
import { handleActionError, handleActionSuccess } from '@/lib/new/action'
import { getSessionToken, removeSession, setSession } from '@/lib/session'
import type { User } from '@/core/types'
import type { SessionData } from '@/lib/session'
import type { ActionResponse } from '@/lib/new/action'

export async function getUser(): Promise<User | null> {
  const sessionToken = await getSessionToken()

  const {
    data: { data: user },
  } = await api.get<{
    data: User
  }>('/auth/user', { sessionToken })

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

export async function forgotPassword(data: {
  email: string
}): Promise<ActionResponse<null>> {
  const { email } = data

  try {
    const { status } = await api.post('/auth/forgot-password', { email })

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function resetPassword(data: {
  token: string
  email: string
  password: string
  passwordConfirmation: string
}): Promise<ActionResponse<null>> {
  const { token, email, password, passwordConfirmation } = data

  try {
    const {
      status,
      data: { data: sessionData },
    } = await api.post<{
      data: SessionData
    }>('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })

    await setSession(sessionData)

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function sendEmailVerificationNotification(): Promise<
  ActionResponse<null>
> {
  const sessionToken = await getSessionToken()

  try {
    const { status } = await api.post(
      '/auth/user/email/notification',
      {},
      { sessionToken },
    )

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function logout() {
  const sessionToken = await getSessionToken()

  await api.post('/auth/logout', {}, { sessionToken }).catch(() => {})
  await removeSession()
}
