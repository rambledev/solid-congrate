import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const std_code = formData.get("std_code") as string;
  const files = formData.getAll("files") as File[];

  if (!std_code || files.length === 0) {
    return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public/uploads/docs");
  const client = await pool.connect();

  try {
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = uuidv4() + path.extname(file.name);

      // บันทึกไฟล์ลงโฟลเดอร์
      await writeFile(path.join(uploadDir, filename), buffer);

      // บันทึกลงฐานข้อมูล
      await client.query(
        `INSERT INTO tb_docs (std_code, filename, original_name, file_type)
         VALUES ($1, $2, $3, $4)`,
        [std_code, filename, file.name, file.type]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาด" }, { status: 500 });
  } finally {
    client.release();
  }
}


export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const std_code = searchParams.get("std_code");
  
      if (!std_code) {
        return NextResponse.json(
          { success: false, message: "Missing std_code" },
          { status: 400 }
        );
      }
  
      const client = await pool.connect();
      const result = await client.query(
        `SELECT id, filename, original_name, file_type, uploaded_at
         FROM tb_docs
         WHERE std_code = $1
         ORDER BY uploaded_at DESC`,
        [std_code]
      );
      client.release();
  
      return NextResponse.json({ success: true, files: result.rows });
    } catch (error) {
      console.error("GET docs error:", error);
      return NextResponse.json(
        { success: false, message: "เกิดข้อผิดพลาด" },
        { status: 500 }
      );
    }
  }
  