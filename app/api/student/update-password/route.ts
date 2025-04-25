import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { std_code, newPassword } = await req.json();

    if (!std_code || !newPassword) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const client = await pool.connect();

    // ตรวจสอบว่านักศึกษามีอยู่จริงไหม
    const checkResult = await client.query(
      "SELECT std_code FROM tb_student WHERE std_code = $1",
      [std_code]
    );

    if (checkResult.rowCount === 0) {
      client.release();
      return NextResponse.json({ success: false, message: "ไม่พบนักศึกษา" }, { status: 404 });
    }

    // เข้ารหัส password ก่อนบันทึก
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่าน
    await client.query(
      "UPDATE tb_student SET password = $1 WHERE std_code = $2",
      [hashedPassword, std_code]
    );

    client.release();

    return NextResponse.json({ success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error("Update Password Error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}
