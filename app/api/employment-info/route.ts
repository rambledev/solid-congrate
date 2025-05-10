import { NextResponse } from 'next/server'
import pool from '@/lib/db' // เชื่อมกับ Database PostgreSQL เหมือน API อื่นของคุณ

export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(
      `SELECT name, phone, province, work_status, other_status
       FROM tb_survey
       ORDER BY id ASC`
    )
    client.release()

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error fetching employment info:', error)
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    )
  }
}
