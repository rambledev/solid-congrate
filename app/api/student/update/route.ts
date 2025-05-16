// app/api/student/update/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      std_code,
      name_th,
      birthdate,
      email,
      citizen,
      img,
      // เพิ่มฟิลด์อื่นตามที่คุณมีในแบบฟอร์ม
    } = data

    const result = await pool.query(
      `UPDATE tb_student
       SET name_th = $1,
           birthdate = $2,
           email = $3,
           citizen = $4,
           img = $5
       WHERE std_code = $6`,
      [name_th, birthdate, email, citizen, img, std_code]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการอัปเดต" }, { status: 500 })
  }
}
