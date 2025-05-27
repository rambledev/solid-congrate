// api/member/set-password/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  console.log("🟢 เข้าสู่ API /api/member/set-password");

  try {
    const { id, newPassword } = await req.json();
    console.log("📥 รับคำขอตั้งรหัสผ่านใหม่ สำหรับ ID:", id);

    if (!id || !newPassword) {
      return NextResponse.json(
        { success: false, message: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // Hash password ใหม่
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const client = await pool.connect();
    
    const result = await client.query(
      "UPDATE tb_member SET password = $1, firstpass = false WHERE id = $2 AND role IN ('cio', 'admin') RETURNING id, name, role",
      [hashedPassword, id]
    );
    
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบผู้ใช้หรือไม่มีสิทธิ์" },
        { status: 404 }
      );
    }

    console.log("✅ ตั้งรหัสผ่านใหม่สำเร็จ:", result.rows[0].name);
    
    return NextResponse.json({
      success: true,
      message: "ตั้งรหัสผ่านใหม่สำเร็จ",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}