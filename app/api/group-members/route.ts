import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: Request) {
  const client = await pool.connect()

  try {
    const { searchParams } = new URL(req.url)
    const group = searchParams.get('group')
    const sort = searchParams.get('sort') || 'default'

    if (!group) return NextResponse.json([], { status: 400 })

    let result

    if (sort === 'honor') {
      result = await client.query(
        `
        SELECT * FROM tb_student
        WHERE group_name = $1
        ORDER BY 
          CASE 
            WHEN note = 'เกียรตินิยมอันดับ 1' THEN 1
            WHEN note = 'เกียรตินิยมอันดับ 2' THEN 2
            ELSE 3
          END,
          num ASC
        `,
        [group]
      )
    } else if (sort === 'name') {
      result = await client.query(
        `
        SELECT * FROM tb_student
        WHERE group_name = $1
        ORDER BY 
          regexp_replace(name_th, '^(นาย|นางสาว|น.ส.)\\s*', '', 'i') ASC
        `,
        [group]
      )
    } else {
      result = await client.query(
        `SELECT * FROM tb_student WHERE group_name = $1 ORDER BY num ASC`,
        [group]
      )
    }

    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('ERROR in /api/group-members:', err)
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  } finally {
    client.release()
  }
}
