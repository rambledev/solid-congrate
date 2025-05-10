import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT 
         *
       FROM tb_regist r
       JOIN tb_student s ON r.std_code = s.std_code
       ORDER BY r.std_code ASC`
    );
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET all registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
