import { NextResponse } from "next/server";
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ

// Endpoint สำหรับดึง checklist ตามวันที่หรือตามทั้งหมด
export async function GET(req) {
  console.error("API /api/checklist hit");
  try {
    const url = new URL(req.url);
    const { pathname } = url;

    // เช็ค Endpoint
    if (pathname.endsWith("/checklist")) {
      // ตรวจสอบว่ามีพารามิเตอร์ date หรือไม่
      if (url.searchParams.has("date")) {
        const date = url.searchParams.get("date");
        // ดึงข้อมูลตามวันที่
        const result = await pool.query(
          "SELECT a.*,b.* FROM tb_checklist a left join tb_student b on a.std_code = b.std_code WHERE a.timestamp::date = $1",
          [date]
        );

        return NextResponse.json({ 
          message: "ดึงข้อมูลสำเร็จ", 
          data: result.rows 
        }, { status: 200 });
      } else {
        // หากไม่มี date ให้ดึงข้อมูลทั้งหมด
        const result = await pool.query("SELECT a.*,b.* FROM tb_checklist a left join tb_student b on a.std_code = b.std_code");

        return NextResponse.json({ 
          message: "ดึงข้อมูลสำเร็จ", 
          data: result.rows 
        }, { status: 200 });
      }
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