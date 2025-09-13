import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Security headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Robots-Tag': req.nextUrl.pathname.startsWith('/dashboard') ? 'noindex' : '',
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) res.headers.set(key, value)
  })

  // Rate limiting for API routes (basic implementation)
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    // In production, implement proper rate limiting with Redis or similar
    console.log(`API request from IP: ${ip} to ${req.nextUrl.pathname}`)
  }

  // Check authentication for protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Redirect to login if not authenticated
        const redirectUrl = new URL('/auth/login', req.url)
        redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Refresh session if needed
      await supabase.auth.getUser()
      
    } catch (error) {
      console.error('Auth middleware error:', error)
      // Redirect to login on auth error
      const redirectUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth/') && 
      !req.nextUrl.pathname.includes('/callback')) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Continue to auth page on error
    }
  }

  // CSRF protection for forms
  if (req.method === 'POST' && req.nextUrl.pathname.startsWith('/api/')) {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host')
    
    if (origin && host && !origin.includes(host)) {
      console.warn(`CSRF attempt detected: origin ${origin} !== host ${host}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}