import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET: ดึงข้อมูล wish_title และ wish_uniform
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const std_code = searchParams.get("std_code");

    if (!std_code) {
      return NextResponse.json({ success: false, message: "Missing std_code" }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      `SELECT wish_title, wish_uniform 
       FROM tb_student 
       WHERE std_code = $1`,
      [std_code]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Wish GET error:", err);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

// ✅ POST: บันทึกข้อมูล wish_title และ wish_uniform
export async function POST(req: Request) {
  try {
    const { std_code, wish_title, wish_uniform } = await req.json();
    const client = await pool.connect();

    await client.query(
      `UPDATE tb_student
       SET wish_title = $1, wish_uniform = $2
       WHERE std_code = $3`,
      [wish_title, wish_uniform, std_code]
    );

    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Wish update error:", err);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
