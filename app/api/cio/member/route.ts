// ✅ [1] API: app/api/member/route.ts

import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  const client = await pool.connect()
  const res = await client.query('SELECT * FROM tb_member ORDER BY id ASC')
  client.release()
  return NextResponse.json(res.rows)
}

export async function POST(req: Request) {
  const data = await req.json()
  const { name, faculty, program, phone, password, firstpass, role } = data
  const client = await pool.connect()
  await client.query(
    `INSERT INTO tb_member (name, faculty, program, phone, password, firstpass, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, faculty, program, phone, password, firstpass, role]
  )
  client.release()
  return NextResponse.json({ success: true })
}

export async function PUT(req: Request) {
  const data = await req.json()
  const { id, name, faculty, program, phone, password, firstpass, role } = data
  const client = await pool.connect()

  await client.query(
    `UPDATE tb_member
     SET name = $1, faculty = $2, program = $3, phone = $4, password = $5, firstpass = $6, role = $7
     WHERE id = $8`,
    [name, faculty, program, phone, password, firstpass, role, id]
  )

  client.release()
  return NextResponse.json({ success: true })
}
