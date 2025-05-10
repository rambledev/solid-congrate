import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const date = searchParams.get('date') || ''
  const faculty = searchParams.get('faculty') || ''
  const program = searchParams.get('program') || ''
  const sort = searchParams.get('sort') || 'std_code'
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const offset = (page - 1) * pageSize

  // Dynamic condition builder
  const conditions: string[] = []
  const values: (string | number)[] = []

  if (date) {
    values.push(date)
    conditions.push(`a.timestamp::date = $${values.length}`)
  }
  if (faculty) {
    values.push(faculty)
    conditions.push(`b.faculty = $${values.length}`)
  }
  if (program) {
    values.push(program)
    conditions.push(`b.program = $${values.length}`)
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

  // Count
  const countQuery = `
    SELECT COUNT(*) FROM tb_checklist a
    LEFT JOIN tb_student b ON a.std_code = b.std_code
    ${whereClause}
  `
  const countResult = await pool.query(countQuery, values)
  const total = parseInt(countResult.rows[0].count)

  // Data
  values.push(pageSize, offset) // append limit & offset
  const dataQuery = `
    SELECT a.timestamp, a.std_code, b.faculty, b.program, a.check_by
    FROM tb_checklist a
    LEFT JOIN tb_student b ON a.std_code = b.std_code
    ${whereClause}
    ORDER BY ${sort === 'std_code' ? 'a.std_code' : 'a.timestamp'} ASC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `
  const result = await pool.query(dataQuery, values)

  return NextResponse.json({
    data: result.rows,
    total
  })
}
