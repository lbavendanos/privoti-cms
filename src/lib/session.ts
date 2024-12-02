import 'server-only'
import { cookies } from 'next/headers'

export type SessionData = {
  access_token: string
  token_type: string
  expires_in: number
}

export function getSessionKey() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME as string

  return `_${appName.toLowerCase()}_jwt`
}

export async function getSessionToken(): Promise<string | null> {
  const key = getSessionKey()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(key)?.value

  if (!accessToken) return null

  return accessToken
}

export async function setSession({ access_token, expires_in }: SessionData) {
  const key = getSessionKey()
  const cookieStore = await cookies()

  cookieStore.set(key, access_token, {
    maxAge: expires_in,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function removeSession() {
  const key = getSessionKey()
  const cookieStore = await cookies()

  cookieStore.delete(key)
}
