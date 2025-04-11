import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db'; // นำเข้าฟังก์ชัน query
import bcrypt from 'bcrypt'; // สำหรับเข้ารหัสรหัสผ่าน

export async function PUT(request: Request) {
  const { password, std_code } = await request.json(); // แบ่งข้อมูลที่รับมา 

// Log ข้อมูลที่ส่งมา เพื่อการตรวจสอบ
console.log("Received std_code:", std_code);
console.log("Received password:", password);

  // ตรวจสอบความถูกต้องของ password
  if (!password || password.length < 6) {
    return NextResponse.json({ success: false, message: 'Password ต้องมี 6 ตัวขึ้นไป' });
  }

  // เข้ารหัสรหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(password, 10); // ใช้ bcrypt เพื่อเข้ารหัสรหัสผ่านใหม่

  // ขั้นตอนการอัปเดตรหัสผ่านในฐานข้อมูล
  const queryText = `UPDATE tb_member SET password = $1 WHERE std_code = $2`;
  const values = [hashedPassword, std_code];

  try {
    const result = await query(queryText, values);

    if (result.rowCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to change password. No matching user found.' });
    }
  } catch (error) {
    console.error("Database error:", error); // ล็อกข้อผิดพลาด
    return NextResponse.json({ success: false, message: 'Database error occurred' });
  }
}