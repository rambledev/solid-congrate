import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fac_type = searchParams.get('fac_type')
  const faculty = searchParams.get('faculty')
  const program = searchParams.get('program')

  const whereClauses: string[] = []
  if (fac_type) whereClauses.push(`fac_type = '${fac_type}'`)
  if (faculty) whereClauses.push(`faculty = '${faculty}'`)
  if (program) whereClauses.push(`program = '${program}'`)
  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  try {
    const client = await pool.connect()

    // 1. Degree Statistics
    const degreeQuery = `
      SELECT degree, COUNT(*) AS count
      FROM tb_student
      ${whereSQL}
      GROUP BY degree
    `
    console.log('📊 degreeQuery:', degreeQuery)
    const degreeRes = await client.query(degreeQuery)

    // 2. Honor Statistics
    const honorQuery = `
      SELECT note, COUNT(*) AS count
      FROM tb_student
      ${whereSQL ? whereSQL + ' AND' : 'WHERE'} note IN ('เกียรตินิยมอันดับ 1', 'เกียรตินิยมอันดับ 2')
      GROUP BY note
    `
    console.log('🎖 honorQuery:', honorQuery)
    const honorRes = await client.query(honorQuery)

    // 3. Registration Status
    const registQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN regist_status = 'ลงทะเบียนแล้ว' THEN 1 ELSE 0 END), 0) AS registered,
        COALESCE(SUM(CASE WHEN regist_status = 'ยังไม่ลงทะเบียน' THEN 1 ELSE 0 END), 0) AS not_registered
      FROM tb_student
      ${whereSQL}
    `
    console.log('📝 registQuery:', registQuery)
    const registRes = await client.query(registQuery)

    // 4. Survey Status
    const surveyQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN work_status = 'เพิ่มข้อมูลแล้ว' THEN 1 ELSE 0 END), 0) AS surveyed,
        COALESCE(SUM(CASE WHEN work_status = 'ยังไม่เพิ่มข้อมูล' THEN 1 ELSE 0 END), 0) AS not_surveyed
      FROM tb_student
      ${whereSQL}
    `
    console.log('📋 surveyQuery:', surveyQuery)
    const surveyRes = await client.query(surveyQuery)

    // 5. Graduation Confirmation Status (JOIN tb_student)
    const confirmQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN cost_option = '1' THEN 1 ELSE 0 END), 0) AS "1",
        COALESCE(SUM(CASE WHEN cost_option = '2' THEN 1 ELSE 0 END), 0) AS "2",
        COALESCE(SUM(CASE WHEN cost_option = '3' THEN 1 ELSE 0 END), 0) AS "3",
        COALESCE(SUM(CASE WHEN cost_option = '4' THEN 1 ELSE 0 END), 0) AS "4"
      FROM tb_regist
      JOIN tb_student ON tb_regist.std_code = tb_student.std_code
      ${whereSQL}
    `
    console.log('🎓 confirmQuery:', confirmQuery)
    const confirmRes = await client.query(confirmQuery)

    client.release()

    return NextResponse.json({
      success: true,
      degreeStats: Object.fromEntries(degreeRes.rows.map(r => [r.degree, parseInt(r.count)])),
      honorStats: Object.fromEntries(honorRes.rows.map(r => [r.note, parseInt(r.count)])),
      registrationStatus: {
        registered: parseInt(registRes.rows[0].registered ?? '0'),
        not_registered: parseInt(registRes.rows[0].not_registered ?? '0'),
      },
      surveyStatus: {
        surveyed: parseInt(surveyRes.rows[0].surveyed ?? '0'),
        not_surveyed: parseInt(surveyRes.rows[0].not_surveyed ?? '0'),
      },
      graduationStatus: {
        '1': parseInt(confirmRes.rows[0]['1'] ?? '0'),
        '2': parseInt(confirmRes.rows[0]['2'] ?? '0'),
        '3': parseInt(confirmRes.rows[0]['3'] ?? '0'),
        '4': parseInt(confirmRes.rows[0]['4'] ?? '0'),
      }
    })
  } catch (err) {
    console.error('❌ Error in /api/dashboard:', err)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
