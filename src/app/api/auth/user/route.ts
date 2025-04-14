import { getUser } from '@/core/actions/auth'
import { isFetchError } from '@/lib/fetcher/base'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getUser()

    return NextResponse.json(user)
  } catch (error) {
    if (isFetchError(error)) {
      const { status, message, errors } = error
      return NextResponse.json({ message, errors }, { status })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
