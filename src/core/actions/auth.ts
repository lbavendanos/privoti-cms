'use server'

import { core } from '@/lib/fetcher/core'
import { removeSession, setSession } from '@/lib/session'
import { errorResponse, successResponse } from '@/lib/action'
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
 * @param {Object} payload - The user data to update.
 * @returns {Promise<ActionResponse<User | null>>} The updated user data.
 */
export async function updateUser(payload: {
  name: string
}): Promise<ActionResponse<User | null>> {
  try {
    const { data: user } = await core.fetch<{
      data: User
    }>('/auth/user', { method: 'PUT', body: payload })

    return successResponse(user)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to update the user password authenticated in the app.
 *
 * @param {Object} payload - The password data to update.
 * @returns {Promise<ActionResponse<null>>} The status of the update.
 */
export async function updatePassword(payload: {
  currentPassword: string
  password: string
}): Promise<ActionResponse<null>> {
  try {
    await core.fetch('/auth/user/password', {
      method: 'POST',
      body: {
        current_password: payload.currentPassword,
        password: payload.password,
      },
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to login a user.
 *
 * @param {Object} payload - The login data.
 * @returns {Promise<ActionResponse<null>>} The status of the login.
 */
export async function login(payload: {
  email: string
  password: string
}): Promise<ActionResponse<null>> {
  try {
    const { data: sessionData } = await core.fetch<{
      data: SessionData
    }>('/auth/login', { method: 'POST', body: payload })

    await setSession(sessionData)

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to send a password reset email to the user.
 *
 * @param {Object} payload - The forgot password data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function forgotPassword(payload: {
  email: string
}): Promise<ActionResponse<null>> {
  try {
    await core.fetch('/auth/forgot-password', { method: 'POST', body: payload })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to reset the password of a user.
 *
 * @param {Object} payload - The password reset data.
 * @returns {Promise<ActionResponse<null>>} The status of the reset.
 */
export async function resetPassword(payload: {
  token: string
  email: string
  password: string
  passwordConfirmation: string
}): Promise<ActionResponse<null>> {
  try {
    const { data: sessionData } = await core.fetch<{
      data: SessionData
    }>('/auth/reset-password', {
      method: 'POST',
      body: {
        token: payload.token,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      },
    })

    await setSession(sessionData)

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
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
  try {
    await core.fetch('/auth/user/email/notification', { method: 'POST' })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to send a verification email to the new email address of the user authenticated in the app.
 *
 * @param {Object} payload - The email data.
 * @returns {Promise<ActionResponse<null>>} The status of the request.
 */
export async function sendEmailChangeVerificationNotification(payload: {
  email: string
}): Promise<ActionResponse<null>> {
  try {
    await core.fetch('/auth/user/email/new/notification', {
      method: 'POST',
      body: payload,
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to verify the email of the user authenticated in the app.
 *
 * @param {Object} payload - The email verification parameters.
 * @returns {Promise<ActionResponse<null>>} The status of the verification.
 */
export async function verifyEmail(payload: {
  id: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse<null>> {
  const { id, token: hash, expires, signature } = payload

  try {
    await core.fetch(`/auth/user/email/verify/${id}/${hash}`, {
      params: { expires, signature },
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to verify the new email of the user authenticated in the app.
 *
 * @param {Object} payload - The new email verification parameters.
 * @returns {Promise<ActionResponse<null>>} The status of the verification.
 */
export async function verifyNewEmail(payload: {
  id: string
  email: string
  token: string
  expires: string
  signature: string
}): Promise<ActionResponse<null>> {
  const { id, email, token: hash, expires, signature } = payload

  try {
    await core.fetch(`/auth/user/email/new/verify/${id}/${email}/${hash}`, {
      params: { expires, signature },
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

/**
 * This function is used to logout the user authenticated in the app.
 */
export async function logout() {
  await core.fetch('/auth/logout', {}).catch(() => {})
  await removeSession()
}
