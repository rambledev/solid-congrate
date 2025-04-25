import { NextRequest, NextResponse } from "next/server";
import { saveImageFile } from "@/lib/saveImageFile";
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ


export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;
  const std_code = formData.get("std_code") as string;

  if (!file || !std_code) {
    return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  try {
    const filename = `${std_code}-${Date.now()}.jpg`;
    await saveImageFile(file, filename);

    // อัปเดตฐานข้อมูล
    await pool.query(
      "UPDATE tb_student SET img = $1 WHERE std_code = $2",
      [filename, std_code]
    );

    return NextResponse.json({ success: true, message: "อัปโหลดสำเร็จ", filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "อัปโหลดไม่สำเร็จ" }, { status: 500 });
  }
}
