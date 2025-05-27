import { NextResponse } from 'next/server'
import  pool  from '@/lib/db'

export async function POST(req: Request) {
  const { std_code_a, std_code_b } = await req.json()

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const resA = await client.query(`SELECT num FROM tb_student WHERE std_code = $1`, [std_code_a])
    const resB = await client.query(`SELECT num FROM tb_student WHERE std_code = $2`, [std_code_b])

    const numA = resA.rows[0].num
    const numB = resB.rows[0].num

    await client.query(`UPDATE tb_student SET num = $1 WHERE std_code = $2`, [numB, std_code_a])
    await client.query(`UPDATE tb_student SET num = $1 WHERE std_code = $2`, [numA, std_code_b])

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    return NextResponse.json({ success: false, error: err }, { status: 500 })
  } finally {
    client.release()
  }
}
