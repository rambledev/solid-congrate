import { NextResponse } from 'next/server'
import pool from '@/lib/db' // ใช้ pool เดียวกัน

export async function POST(req: Request) {
  const client = await pool.connect()

  try {
    const { std_code } = await req.json()

    if (!std_code) {
      return NextResponse.json({ success: false, message: 'รหัสนักศึกษาไม่ถูกต้อง' }, { status: 400 })
    }

    const check = await client.query('SELECT * FROM tb_student WHERE std_code = $1', [std_code])
    if (check.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'ไม่พบนักศึกษาที่ต้องการลบ' }, { status: 404 })
    }

    await client.query('DELETE FROM tb_student WHERE std_code = $1', [std_code])

    return NextResponse.json({ success: true, message: 'ลบนักศึกษาเรียบร้อยแล้ว' })
  } catch (err) {
    console.error('ลบนักศึกษา error:', err)
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 })
  } finally {
    client.release()
  }
}
