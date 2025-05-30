// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt'; // ให้ใช้ bcrypt ในการตรวจสอบรหัสผ่าน
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ


export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  try {
    const client = await pool.connect();
    
    // ตรวจสอบ std_code
    const query = 'SELECT * FROM tb_member WHERE std_code = $1';
    const values = [username];
    const result = await client.query(query, values);

    // ปล่อย client กลับไปหลังจากใช้งาน
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'ไม่พบ username' }, { status: 404 });
    }

    const user = result.rows[0];

    // ตรวจสอบ password
    if (user.password) {
      // หากมี password ที่เข้ารหัส
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
      }
    } else if (user.firstpass) {
      // หาก password ไม่มี ให้ตรวจสอบ firstpass
      if (user.firstpass !== password) {
        return NextResponse.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
      }
    }

    // หากตรวจสอบทุกอย่างผ่าน
    return NextResponse.json({ success: true, user: user });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}