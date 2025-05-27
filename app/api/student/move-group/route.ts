import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  const client = await pool.connect()

  try {
    const { std_code, new_group } = await req.json()

    await client.query("BEGIN")

    // 1. ดึง group และ num เดิมของนักศึกษา
    const res = await client.query(
      `SELECT group_name, num FROM tb_student WHERE fix_num = $1`,
      [std_code]
    )

    const old_group = res.rows[0]?.group_name
    const old_num = res.rows[0]?.num

    if (!old_group || old_num === undefined) {
      throw new Error("ไม่พบข้อมูลนักศึกษา")
    }

    // 2. หา max(num) ของกลุ่มใหม่
    const resMax = await client.query(
      `SELECT COALESCE(MAX(num), 0) AS max_num FROM tb_student WHERE group_name = $1`,
      [new_group]
    )
    const new_num = resMax.rows[0].max_num + 1

    // 3. อัปเดต group_name และ num ใหม่ให้กับนักศึกษา
    await client.query(
      `UPDATE tb_student SET group_name = $1, num = $2 WHERE fix_num = $3`,
      [new_group, new_num, std_code]
    )

    // 4. ปรับ num ของคนอื่นในกลุ่มเดิมให้เลื่อนขึ้น
    await client.query(
      `UPDATE tb_student SET num = num - 1 WHERE group_name = $1 AND num > $2`,
      [old_group, old_num]
    )

    await client.query("COMMIT")
    return NextResponse.json({ success: true })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Move group error:", error)
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาดในการย้ายกลุ่ม" }, { status: 500 })
  } finally {
    client.release()
  }
}
