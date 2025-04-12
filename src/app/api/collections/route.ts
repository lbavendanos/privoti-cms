import { isApiError } from '@/lib/http'
import { getCollections } from '@/core/actions/collection'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())
    const response = await getCollections(params)

    return NextResponse.json(response)
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
