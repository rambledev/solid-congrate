// app/auth/login/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function POST(request: Request) {
  // ...โค้ดเดิมของคุณ...
}

// เพิ่มส่วนนี้ถ้าต้องการตรวจสอบ session ผ่าน API
export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (token?.value) {
    return NextResponse.json(
      { error: 'Already authenticated' },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: 'Login page' },
    { status: 200 }
  );
}