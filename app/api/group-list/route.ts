import { NextResponse } from 'next/server'
import  pool  from '@/lib/db' // แก้ตามโฟลเดอร์ของคุณ

export async function GET() {
  const result = await pool.query(`SELECT DISTINCT group_name FROM tb_student WHERE group_name IS NOT NULL ORDER BY group_name`)
  const groups = result.rows.map(row => row.group_name)
  return NextResponse.json(groups)
}
