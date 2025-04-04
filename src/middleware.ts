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

  if (path === '/settings') {
    return NextResponse.redirect(new URL('/settings/store', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'next-action' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
