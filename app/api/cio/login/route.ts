import  pool  from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, password } = await request.json();

  try {
    // ค้นหาผู้ใช้ในฐานข้อมูล
    const result = await pool.query(
      "SELECT * FROM tb_member WHERE name = $1 AND role = 'cio'",
      [name]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials or not a CIO" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // สร้าง response และตั้งค่า cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

    // ตั้งค่า session cookie
    response.cookies.set("cio-session", JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 วัน
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}