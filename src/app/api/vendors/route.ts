import { getVendors } from '@/core/actions/vendor'
import { isFetchError } from '@/lib/fetcher/base'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries())
    const response = await getVendors(params)

    return NextResponse.json(response)
  } catch (error) {
    if (isFetchError(error)) {
      const { status, message, errors } = error
      return NextResponse.json({ message, errors }, { status })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
