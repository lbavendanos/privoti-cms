import { getProduct } from '@/core/actions/product'
import { isFetchError } from '@/lib/fetcher/base'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const response = await getProduct(id)

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
