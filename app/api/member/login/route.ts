// api/member/login/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  console.log("🟢 เข้าสู่ API /api/member/login");

  try {
    const { name, password } = await req.json();
    console.log("📥 รับข้อมูลจาก client:", { name, password: "***" });

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!name || !password) {
      console.log("❌ ข้อมูลไม่ครบถ้วน");
      return NextResponse.json(
        { success: false, message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    // ค้นหาผู้ใช้จากตาราง tb_member
    const result = await client.query(
      "SELECT * FROM tb_member WHERE name = $1 AND role IN ('cio', 'admin')",
      [name]
    );
    
    client.release();

    if (result.rows.length === 0) {
      console.log("❌ ไม่พบผู้ใช้:", name);
      return NextResponse.json(
        { success: false, message: "ไม่พบผู้ใช้หรือไม่มีสิทธิ์เข้าถึง" },
        { status: 404 }
      );
    }

    const member = result.rows[0];
    const storedPassword = member.password;

    console.log("👤 พบผู้ใช้:", {
      id: member.id,
      name: member.name,
      role: member.role,
      faculty: member.faculty,
      program: member.program
    });

    // ตรวจสอบว่ามี password หรือไม่
    if (!storedPassword || storedPassword === "" || storedPassword === "-") {
      console.log("❌ ยังไม่มีการตั้งรหัสผ่าน");
      return NextResponse.json(
        { 
          success: false, 
          message: "ยังไม่มีการตั้งรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ",
          needSetPassword: true
        },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่านด้วย bcrypt
    console.log("🔐 ตรวจสอบรหัสผ่านด้วย bcrypt");
    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch) {
      console.log("❌ รหัสผ่านไม่ถูกต้อง");
      return NextResponse.json(
        { success: false, message: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ลบข้อมูลรหัสผ่านออกก่อนส่งกลับ
    const { password: _, ...memberData } = member;

    console.log("✅ Login สำเร็จ:", {
      name: member.name,
      role: member.role
    });

    return NextResponse.json({ 
      success: true, 
      data: memberData,
      message: `เข้าสู่ระบบสำเร็จในฐานะ ${member.role.toUpperCase()}`
    });

  } catch (error) {
    console.error("💥 เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}