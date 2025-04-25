import { NextResponse } from 'next/server';
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ

// ฟังก์ชันสำหรับการบันทึกข้อมูล QR Code
export async function POST(req) {
  try {
    // รับข้อมูลจาก request
    const { std_code, check_by, status, timestamp, round, location } = await req.json();

    // ตรวจสอบหากมีข้อมูลซ้ำในวันเดียวกัน
    const existingEntry = await pool.query(`
      SELECT * FROM tb_checklist 
      WHERE std_code = $1 AND DATE(timestamp) = DATE($2)
    `, [std_code, timestamp]);

    if (existingEntry.rows.length > 0) {
      return NextResponse.json({
        message: "ข้อมูลซ้ำ",
        error: "Duplicate entry"
      }, { status: 409 });
    }

    // สั่งให้ insert ข้อมูลลง tb_checklist
    const result = await pool.query(
      "INSERT INTO tb_checklist (std_code, timestamp, check_by, status, round, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [std_code, timestamp, check_by, status, round, location] // เพิ่ม round และ location
    );

    // ส่งข้อมูลกลับ
    return NextResponse.json({ 
      message: "ข้อมูลถูกบันทึกเรียบร้อย", 
      data: result.rows[0] // ข้อมูลที่บันทึกเข้าไป
    }, { status: 201 });

  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ 
      message: "เกิดข้อผิดพลาด", 
      error: error.message 
    }, { status: 500 });
  }
}