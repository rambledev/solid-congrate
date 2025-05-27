// api/member/list/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  console.log("🟢 เข้าสู่ API /api/member/list");

  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role'); // 'cio', 'admin', หรือ null (ทั้งหมด)

    const client = await pool.connect();
    
    let query = "SELECT id, name, faculty, program, phone, role, firstpass FROM tb_member WHERE role IN ('cio', 'admin')";
    let params: any[] = [];

    if (role && (role === 'cio' || role === 'admin')) {
      query += " AND role = $1";
      params.push(role);
    }

    query += " ORDER BY role, name";

    const result = await client.query(query, params);
    client.release();

    console.log(`✅ ดึงรายการ member สำเร็จ: ${result.rows.length} รายการ`);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}