// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // ✅ ยังไม่ตรวจ session/token ใด ๆ
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'] // เฉพาะ admin route
}
