import { NextResponse } from "next/server";
import pool from '../../../../lib/db'; // นำเข้าจาก db.js

// Endpoint สำหรับดึงสมาชิกทั้งหมด
export async function GET(req) {
  console.error("API /api/member/allmember hit");
  try {
    const url = new URL(req.url);
    const { pathname } = url;
    console.error("API /api/member/allmember hit");
    // เช็ค Endpoint
    if (pathname.endsWith("/allmember")) {
      const result = await pool.query("SELECT * FROM tb_member");
      return NextResponse.json({ 
        message: "ดึงข้อมูลสำเร็จ", 
        data: result.rows 
      }, { status: 200 });
    } else if (url.searchParams.has("std_code")) {
      // หากมี std_code ใน query params
      const stdCode = url.searchParams.get("std_code");
      const result = await pool.query(
        "SELECT * FROM tb_member WHERE std_code = $1",
        [stdCode]
      );

      return NextResponse.json({ 
        message: "ดึงข้อมูลสำเร็จ", 
        data: result.rows 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid endpoint" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ 
      message: "เกิดข้อผิดพลาด", 
      error: error.message // แสดงข้อความผิดพลาด
    }, { status: 500 });
  }
}
