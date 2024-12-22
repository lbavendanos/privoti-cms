import { url } from '@/lib/utils'
import { verifyEmail, verifyNewEmail } from '@/core/actions/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/?verified=1'

  try {
    const id = searchParams.get('id')
    const token = searchParams.get('token')
    const expires = searchParams.get('expires')
    const signature = searchParams.get('signature')

    if (!id || !token || !expires || !signature) {
      throw new Error('Missing id, token, expires or signature')
    }

    if (type === 'verify-email') {
      await verifyEmail({ id, token, expires, signature })
    }

    if (type === 'verify-new-email') {
      const email = searchParams.get('email')

      if (!email) {
        throw new Error('Missing email')
      }

      await verifyNewEmail({ id, email, token, expires, signature })
    }
  } catch {
    return NextResponse.redirect(url('/auth/error'))
  }

  return NextResponse.redirect(url(next))
}
