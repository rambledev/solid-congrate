import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  console.log("🟢 เข้าสู่ API /api/student/login");

  const { std_code, password } = await req.json();
  console.log("📥 รับข้อมูลจาก client:", { std_code, password });

  const client = await pool.connect();
  const result = await client.query(
    "SELECT * FROM tb_student WHERE std_code = $1",
    [std_code]
  );
  client.release();

  if (result.rows.length === 0) {
    console.log("❌ ไม่พบนักศึกษา:", std_code);
    return NextResponse.json(
      { success: false, message: "ไม่พบนักศึกษา" },
      { status: 404 }
    );
  }

  const student = result.rows[0];
  const storedPassword = student.password;

  // ✅ หากยังไม่มี password จริง (null, "", "-") → ใช้วันเดือนปีเกิด
  if (!storedPassword || storedPassword === "" || storedPassword === "-") {
    const birthdate = new Date(student.birthdate);
    const expectedPassword = `${birthdate.getFullYear()}${(birthdate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${birthdate.getDate().toString().padStart(2, "0")}`;

    console.log("🔐 ยังไม่มีรหัสผ่าน → ตรวจจากวันเกิด:", expectedPassword);

    if (password !== expectedPassword) {
      console.log("❌ รหัสผ่านจากวันเกิดไม่ตรง");
      return NextResponse.json(
        { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    console.log("✅ Login สำเร็จด้วยวันเดือนปีเกิด:", std_code);
    return NextResponse.json({ success: true, data: student });
  }

  // ✅ กรณีมี password → ใช้ bcrypt เปรียบเทียบ
  console.log("🔐 มีการตั้งรหัสผ่าน → ตรวจด้วย bcrypt");

  const isMatch = await bcrypt.compare(password, storedPassword);

  if (!isMatch) {
    console.log("❌ รหัสผ่านไม่ตรง (bcrypt)");
    return NextResponse.json(
      { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  console.log("✅ Login สำเร็จด้วย bcrypt:", std_code);
  return NextResponse.json({ success: true, data: student });
}
