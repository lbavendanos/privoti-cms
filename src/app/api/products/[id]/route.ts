import { isApiError } from '@/lib/http'
import { getProduct } from '@/core/actions/product'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const response = await getProduct(id)

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
