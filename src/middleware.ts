import { getSessionToken } from './lib/session'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/password/forgot', '/password/reset']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  )

  const session = await getSessionToken()

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
