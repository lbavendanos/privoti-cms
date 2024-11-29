import 'server-only'
import { cookies } from 'next/headers'

export type SessionData = {
  access_token: string
  token_type: string
  expires_in: number
}

export async function setSession({ access_token, expires_in }: SessionData) {
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
