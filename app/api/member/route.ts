import { NextResponse } from 'next/server';
import pool from './db'; // นำเข้าจาก db.js

export async function POST(req) {
  try {
    // รับข้อมูลจาก request
    const { studentId, fullName, faculty, program, phone } = await req.json();

    // เชื่อมต่อกับฐานข้อมูล
    const client = await pool.connect();
    
    // สั่งให้ insert ข้อมูลลง tb_member
    const result = await client.query(
      "INSERT INTO tb_member (std_code, name, faculty, program, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [studentId, fullName, faculty, program, phone]
    );

    // ปล่อยการเชื่อมต่อ
    client.release();

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