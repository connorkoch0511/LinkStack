import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isDashboard = createRouteMatcher(['/dashboard(.*)'])
const isAuthPage = createRouteMatcher(['/login', '/signup'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  if (isDashboard(request) && !userId) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  if (isAuthPage(request) && userId) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
