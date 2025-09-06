import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily simplified middleware - will enhance with proper Supabase integration later
export async function middleware(req: NextRequest) {
  // For now, just allow all requests to pass through
  // TODO: Add proper Supabase auth middleware once @supabase/ssr is properly configured
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}