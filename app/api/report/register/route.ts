import pool from "@/lib/db";
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const start_year = searchParams.get('start_year') || ''
  const faculty = searchParams.get('faculty') || ''
  const program = searchParams.get('program') || ''
  const sort = searchParams.get('sort') || 'std_code'
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const offset = (page - 1) * pageSize

  const countQuery = `
    SELECT COUNT(*) FROM tb_regist r
    JOIN tb_student s ON r.std_code = s.std_code
    WHERE ($1 = '' OR s.start_year = $1)
      AND ($2 = '' OR s.faculty = $2)
      AND ($3 = '' OR s.program = $3)
  `
  const countResult = await pool.query(countQuery, [start_year, faculty, program])
  const total = parseInt(countResult.rows[0].count)

  const query = `
    SELECT
      s.std_code, s.name_th, s.faculty, s.program, s.start_year,
      r.academic_year, r.cost_option, r.price, r.created_at
    FROM tb_regist r
    JOIN tb_student s ON r.std_code = s.std_code
    WHERE ($1 = '' OR s.start_year = $1)
      AND ($2 = '' OR s.faculty = $2)
      AND ($3 = '' OR s.program = $3)
    ORDER BY
      ${sort === 'fullname'
        ? `REGEXP_REPLACE(s.name_th, '^(นาย|นางสาว|นาง)\\s*', '')`
        : 's.std_code'}
    LIMIT $4 OFFSET $5
  `
  const result = await pool.query(query, [start_year, faculty, program, pageSize, offset])

  return NextResponse.json({
    data: result.rows,
    total,
  })
}
