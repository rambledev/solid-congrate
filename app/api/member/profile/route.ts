// api/member/profile/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  console.log("🟢 เข้าสู่ API /api/member/profile");

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ไม่ได้ระบุ ID" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    const result = await client.query(
      "SELECT id, name, faculty, program, phone, role, firstpass FROM tb_member WHERE id = $1 AND role IN ('cio', 'admin')",
      [id]
    );
    
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    console.log("✅ ดึงข้อมูล profile สำเร็จ:", result.rows[0].name);
    
    return NextResponse.json({
      success: true,
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
