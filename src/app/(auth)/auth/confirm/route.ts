import { NextRequest, NextResponse } from 'next/server'
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'
import { api } from '@/lib/http'
import { url } from '@/lib/utils'

function confirmFetch(path: string, request: NextRequest) {
  const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies
  const { searchParams } = new URL(request.url)

  const expires = searchParams.get('expires')
  const signature = searchParams.get('signature')

  if (!expires || !signature) {
    throw new Error('Missing expires or signature')
  }

  return api.get(path, {
    params: { expires, signature },
    cookies: cookieStore,
    headers: {
      Origin: url().origin,
      Referer: url().toString(),
      Cookie: cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; '),
    },
  })
}

function verifyEmail(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const id = searchParams.get('id')
  const token = searchParams.get('token')

  if (!id || !token) {
    throw new Error('Missing id or token')
  }

  return confirmFetch(`/auth/admin/email/verify/${id}/${token}`, request)
}

function verifyNewEmail(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const id = searchParams.get('id')
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!id || !email || !token) {
    throw new Error('Missing id, email or token')
  }

  return confirmFetch(
    `/auth/admin/email/new/verify/${id}/${email}/${token}`,
    request,
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/?verified=1'

  try {
    if (type === 'verify-email') {
      await verifyEmail(request)
    }

    if (type === 'verify-new-email') {
      await verifyNewEmail(request)
    }
  } catch (error: any) {
    return NextResponse.redirect(url(`/auth/error?type=${type}`))
  }

  return NextResponse.redirect(url(next))
}
