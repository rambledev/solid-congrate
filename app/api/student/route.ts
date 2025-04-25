import { NextResponse } from "next/server";
import pool from "@/lib/db"; // สมมุติใช้ Postgres

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const std_code = searchParams.get("std_code");

  if (!std_code) {
    return NextResponse.json({ success: false, message: "กรุณาระบุรหัสนักศึกษา" }, { status: 400 });
  }

  const client = await pool.connect();
  const result = await client.query("SELECT * FROM tb_student WHERE std_code = $1", [std_code]);
  client.release();

  if (result.rowCount === 0) {
    return NextResponse.json({ success: false, message: "ไม่พบนักศึกษา" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: result.rows[0] });
}
