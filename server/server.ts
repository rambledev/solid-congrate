import { Elysia } from 'elysia';
import { login } from './controllers/authController'; // นำเข้าฟังก์ชัน login
import { createMember } from './controllers/memberController'; // นำเข้าฟังก์ชัน createMember
import { NextRequest, NextResponse } from 'next/server';

// สร้างแอปพลิเคชัน Elysia
const app = new Elysia();

// Route สำหรับการเข้าสู่ระบบ
app.post('/api/auth/login', async (req: NextRequest) => {
  try {
    const body = await req.json();

    // แปลง username และ password เป็น string
    const username: string = String(body.username);
    const password: string = String(body.password);

    const result = await login(username, password);

    if (result.success) {
      return NextResponse.json({ success: true, user: result.user });
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
});

// Route สำหรับการสร้างสมาชิกใหม่
app.post('/api/member', async (req: NextRequest) => {
  try {
    const body = await req.json();
    const result = await createMember(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด", error: error.message }, { status: 500 });
  }
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});