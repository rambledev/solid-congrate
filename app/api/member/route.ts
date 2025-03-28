import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // นำเข้าจาก db.js
import bcrypt from 'bcrypt'; // นำเข้า bcrypt สำหรับการเข้ารหัสรหัสผ่าน

// ฟังก์ชันสำหรับการสร้างสมาชิกใหม่
export async function POST(req) {
  try {
    // รับข้อมูลจาก request
    const { studentId, fullName, faculty, major, phone, password, graduation, rentGown, gownSize, pin, photo } = await req.json();

    // ตรวจสอบว่ามีการส่ง password มาหรือไม่ และเป็นสตริงหรือไม่
    if (typeof password !== 'string' || password.length === 0) {
      throw new Error("Password is required and must be a non-empty string");
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สั่งให้ insert ข้อมูลลง tb_member
    const result = await pool.query(
      "INSERT INTO tb_member (std_code, name, faculty, program, phone, password, graduation, rentGown, gownSize, pin, photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [studentId, fullName, faculty, major, phone, hashedPassword, graduation, rentGown, gownSize, pin, photo]
    );

    // ส่งข้อมูลกลับ
    return NextResponse.json({ 
      message: "บันทึกข้อมูลสำเร็จ", 
      data: result.rows[0] // ข้อมูลที่บันทึกเข้าไป
    }, { status: 201 });

  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ 
      message: "เกิดข้อผิดพลาด", 
      error: error.message // แสดงข้อความผิดพลาด
    }, { status: 500 });
  }
}

