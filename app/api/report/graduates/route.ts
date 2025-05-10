import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const faculty = searchParams.get("faculty") || ""
  const program = searchParams.get("program") || ""
  const note = searchParams.get("note") || ""
  const sort = searchParams.get("sort") || "std_code"
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "20")
  const offset = (page - 1) * pageSize

  // ตัวกรองพื้นฐาน
  const conditions: string[] = []
const values: (string | number)[] = []

  if (faculty) {
    values.push(faculty)
    conditions.push(`faculty = $${values.length}`)
  }
  if (program) {
    values.push(program)
    conditions.push(`program = $${values.length}`)
  }
  if (note) {
    values.push(note)
    conditions.push(`note = $${values.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // ดึงจำนวนทั้งหมดสำหรับ pagination
  const countQuery = `SELECT COUNT(*) FROM tb_student ${whereClause}`
  const countResult = await pool.query(countQuery, values)
  const total = parseInt(countResult.rows[0].count)

  // ดึงข้อมูลจริง
  const dataQuery = `
    SELECT std_code, name_th, faculty, program, note, img
    FROM tb_student
    ${whereClause}
    ORDER BY ${sort === 'name_th' ? 'name_th' : 'std_code'} ASC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `
  const result = await pool.query(dataQuery, [...values, pageSize, offset])

  return NextResponse.json({
    data: result.rows,
    total,
  })
}
