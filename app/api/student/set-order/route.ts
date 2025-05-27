import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const { std_code, new_num } = await req.json();

    const result = await client.query(
      `UPDATE tb_student SET num = $1 WHERE fix_num = $2`,
      [new_num, std_code]
    );

    return NextResponse.json({ success: result.rowCount > 0 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาดในการกำหนดลำดับ" }, { status: 500 });
  } finally {
    client.release();
  }
}
