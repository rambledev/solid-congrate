import { NextResponse } from "next/server";
import pool from "@/lib/db"; // ใช้ PostgreSQL pool เดียวกับที่คุณตั้งไว้

export async function GET(req: Request) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        *
      FROM tb_student
      ORDER BY num ASC
      
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  } finally {
    client.release();
  }
}
