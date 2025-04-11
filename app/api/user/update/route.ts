// app/api/user/update/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db'; // นำเข้าฟังก์ชัน query

export async function PUT(request: Request) {
  const userData = await request.json();

  // Log ข้อมูลที่ส่งมา เพื่อการตรวจสอบ
  console.log("Received userData:", userData);

  // ตรวจสอบว่าข้อมูลสำคัญใน userData นั้นครบถ้วน
  if (!userData.name || !userData.std_code || !userData.phone || !userData.faculty || !userData.program) {
    console.error("Validation Error: Missing required fields");
    return NextResponse.json({ 
      success: false, 
      message: 'Missing required fields: name, student code, phone, faculty, or program' 
    }, { status: 400 });
  }

  // ตัวอย่างการอัปเดตข้อมูลในฐานข้อมูล
  const queryText = `
    UPDATE tb_member
    SET name = $1,
        faculty = $2,
        program = $3,
        phone = $4
    WHERE std_code = $5
  `;

  const values = [
    userData.name,
    userData.faculty,
    userData.program,
    userData.phone,
    userData.std_code 
  ];

  try {
    const result = await query(queryText, values);

    if (result.rowCount > 0) {
      return NextResponse.json({ success: true });
    } else {
      console.error("Update failed: No rows affected");
      return NextResponse.json({ success: false, message: 'Failed to update profile or no rows were updated' }, { status: 404 });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: 'Database error occurred' }, { status: 500 });
  }
}