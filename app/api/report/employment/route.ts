import { NextResponse } from 'next/server'
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const province = searchParams.get('province') || ''
  const work_status = searchParams.get('work_status') || ''
  const sort = searchParams.get('sort') || 'std_code'
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const offset = (page - 1) * pageSize

  const countQuery = `
    SELECT COUNT(*) FROM tb_survey
    WHERE ($1 = '' OR province = $1)
      AND ($2 = '' OR work_status = $2)
  `
  const countResult = await pool.query(countQuery, [province, work_status])
  const total = parseInt(countResult.rows[0].count)

  const dataQuery = `
    SELECT std_code, name, province, phone, email, work_status, other_status, created_at,workplace,work_address
    FROM tb_survey
    WHERE ($1 = '' OR province = $1)
      AND ($2 = '' OR work_status = $2)
    ORDER BY ${sort === 'name' ? 'name' : 'std_code'} ASC
    LIMIT $3 OFFSET $4
  `
  const result = await pool.query(dataQuery, [province, work_status, pageSize, offset])

  return NextResponse.json({
    data: result.rows,
    total,
  })
}
