import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: Request) {
  const client = await pool.connect()

  try {
    const { updates } = await req.json()

    await client.query('BEGIN')

    for (const item of updates) {
      await client.query(
        `UPDATE tb_student SET num = $1 WHERE fix_num = $2`,
        [item.new_num, item.std_code]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error in save-order-bulk:', error)
    return NextResponse.json({ success: false, error: 'บันทึกลำดับล้มเหลว' }, { status: 500 })
  } finally {
    client.release()
  }
}
