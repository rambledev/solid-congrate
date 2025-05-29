import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  // ดึงค่า std_code จาก URL โดยตรง
  const url = new URL(req.url);
  const std_code = url.pathname.split("/").pop();

  if (!std_code) {
    return NextResponse.json({ success: false, message: "Missing std_code" }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT 
         s.name,
         s.std_code,
         s.degree,
         r.cost_option,
         r.height,
         r.weight,
         r.price,
         r.id_card
       FROM tb_regist r
       JOIN tb_student s ON r.std_code = s.std_code
       WHERE r.std_code = $1
       LIMIT 1`,
      [std_code]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูล" }, { status: 404 });
    }

    const row = result.rows[0];
    const cost_option = parseInt(row.cost_option);
    let detail = "";

    if (cost_option === 1) {
      detail = "ลงทะเบียนเข้ารับปริญญาบัตร";
    } else if (cost_option === 2) {
      detail = "ลงทะเบียนเข้ารับปริญญา + เช่าชุดครุยวิทยฐานะ";
    } else if (cost_option === 3) {
      detail = "ลงทะเบียนเข้ารับปริญญาบัตร + ตัดชุดครุยวิทยฐานะ";
    }

    const payload = {
      name: row.name,
      stdCode: row.std_code,
      degree: row.degree,
      detail,
      height: cost_option >= 2 ? row.height : null,
      weight: cost_option >= 2 ? row.weight : null,
      amount: parseFloat(row.price),
      idCard: row.id_card,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET payment error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
