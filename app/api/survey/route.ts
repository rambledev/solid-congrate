import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ


export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      std_code, name, birth_day, birth_month, birth_year,
      address, subdistrict, district, province, zipcode,
      phone, email, work_status, other_status,
      workplace, work_address, position, salary
    } = data;
    

    const client = await pool.connect();

    // 1. Insert survey
    await client.query(
      `INSERT INTO tb_survey (
        std_code, name, birth_day, birth_month, birth_year,
        address, subdistrict, district, province, zipcode,
        phone, email, work_status, other_status,
        workplace, work_address, position, salary
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
                $12,$13,$14,$15,$16,$17,$18)`,
      [
        std_code, name, birth_day, birth_month, birth_year,
        address, subdistrict, district, province, zipcode,
        phone, email, work_status, other_status,
        workplace, work_address, position, salary
      ]
    )
    ;

    // 2. Update work_status ใน tb_student
    await client.query(
      `UPDATE tb_student SET work_status = 'เพิ่มข้อมูลแล้ว' WHERE std_code = $1`,
      [std_code]
    );

    client.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Survey insert error:", error);
    return NextResponse.json(
      { success: false, message: "ไม่สามารถบันทึกข้อมูลได้" },
      { status: 500 }
    );
  }
}
