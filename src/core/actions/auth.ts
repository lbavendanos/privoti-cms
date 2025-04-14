'use server'

import { api } from '@/lib/http'
import { core } from '@/lib/fetcher/core'
import { handleActionError, handleActionSuccess } from '@/lib/action'
import { getSessionToken, removeSession, setSession } from '@/lib/session'
import type { User } from '@/core/types'
import type { SessionData } from '@/lib/session'
import type { ActionResponse } from '@/lib/action'

/**
 * This function is used to get the current user authenticated in the app.
 *
 * @returns {Promise<User>} The user data.
 */
export async function getUser(): Promise<User> {
  const { data: user } = await core.fetch<{
    data: User
  }>('/auth/user')

  return user
}

/**
 * This function is used to update the user authenticated in the app.
 *
 * @param {Object} data - The user data to update.
 * @returns {Promise<ActionResponse<User>>} The updated user data.
 */
export async function updateUser(data: {
  name: string
}): Promise<ActionResponse<User>> {
  const sessionToken = await getSessionToken()
  const { name } = data

  try {
    const {
      status,
      data: { data: user },
    } = await api.put<{
      data: User
    }>('/auth/user', { name }, { sessionToken })

    return handleActionSuccess(status, user)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * This function is used to update the user password authenticated in the app.
 *
 * @param {Object} data - The password data to update.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function updatePassword(data: {
  currentPassword: string
  password: string
}): Promise<ActionResponse<null>> {
  const sessionToken = await getSessionToken()
  const { currentPassword, password } = data

  try {
    const { status } = await api.post(
      '/auth/user/password',
      { current_password: currentPassword, password },
      { sessionToken: sessionToken },
    )

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * This function is used to login a user.
 *
 * @param {Object} data - The login data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
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

/**
 * This function is used to send a password reset email to the user.
 *
 * @param {Object} data - The forgot password data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
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

/**
 * This function is used to reset the password of a user.
 *
 * @param {Object} data - The password reset data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
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

/**
 * This function is used to send a verification email to the user authenticated in the app.
 *
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
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

/**
 * This function is used to send a verification email to the new email address of the user authenticated in the app.
 *
 * @param {Object} data - The email data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function sendEmailChangeVerificationNotification(data: {
  email: string
}): Promise<ActionResponse<null>> {
  const sessionToken = await getSessionToken()
  const { email } = data

  try {
    const { status } = await api.post(
      '/auth/user/email/new/notification',
      { email },
      { sessionToken },
    )

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * This function is used to verify the email of the user authenticated in the app.
 *
 * @param {Object} params - The email verification parameters.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function verifyEmail(params: {
  id: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse<null>> {
  const sessionToken = await getSessionToken()
  const { id, token: hash, expires, signature } = params

  try {
    const { status } = await api.get(`/auth/user/email/verify/${id}/${hash}`, {
      params: { expires, signature },
      sessionToken,
    })

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * This function is used to verify the new email of the user authenticated in the app.
 *
 * @param {Object} params - The new email verification parameters.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function verifyNewEmail(params: {
  id: string
  email: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse<null>> {
  const sessionToken = await getSessionToken()
  const { id, email, token: hash, expires, signature } = params

  try {
    const { status } = await api.get(
      `/auth/user/email/new/verify/${id}/${email}/${hash}`,
      {
        params: { expires, signature },
        sessionToken,
      },
    )

    return handleActionSuccess(status)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * This function is used to logout the user authenticated in the app.
 */
export async function logout() {
  await core.fetch('/auth/logout', {}).catch(() => {})
  await removeSession()
}
