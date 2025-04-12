import { getUser } from '@/core/actions/auth'
import { isApiError } from '@/lib/http'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getUser()

    return NextResponse.json(user)
  } catch (error) {
    const defaultMessage =
      'There was a problem with the server. Please try again.'

    if (
      isApiError<{
        message?: string
        errors?: Record<string, string[]>
      }>(error)
    ) {
      const {
        response: {
          status,
          data: { message, errors },
        },
      } = error

      return NextResponse.json(
        {
          message: message ?? defaultMessage,
          errors,
        },
        { status },
      )
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : defaultMessage },
      { status: 500 },
    )
  }
}
