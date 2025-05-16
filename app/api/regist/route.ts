import { NextResponse } from "next/server";
import pool from "@/lib/db"; // ✅ import มาใช้ตรง ๆ

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      std_code,
      id_card,
      house_no,
      moo,
      village,
      road,
      soi,
      subdistrict,
      district,
      province,
      zipcode,
      phone,
      gender,
      academic_year,
      round,
      cost_option,
      price,
      height,
      weight,
      consent, // ✅ เพิ่ม field consent
    } = data;

    const client = await pool.connect();

    const check = await client.query(
      `SELECT *
   FROM tb_regist r
   JOIN tb_student s ON r.std_code = s.std_code
   WHERE r.std_code = $1`,
      [std_code]
    );

    if (check.rows.length > 0) {
      await client.query(
        `UPDATE tb_regist SET 
          id_card = $1, house_no = $2, moo = $3, village = $4, road = $5, soi = $6,
          subdistrict = $7, district = $8, province = $9, zipcode = $10,
          phone = $11, gender = $12, academic_year = $13, round = $14,
          cost_option = $15, price = $16 , height = $17 , weight = $18
        WHERE std_code = $19`,
        [
          id_card,
          house_no,
          moo,
          village,
          road,
          soi,
          subdistrict,
          district,
          province,
          zipcode,
          phone,
          gender,
          academic_year,
          round,
          cost_option,
          price,
          height,
          weight,
          std_code,
        ]
      );
    } else {
      await client.query(
        `INSERT INTO tb_regist (
          std_code, id_card, house_no, moo, village, road, soi,
          subdistrict, district, province, zipcode,
          phone, gender, academic_year, round,
          cost_option, price ,height,weight
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18 ,$19
        )`,
        [
          std_code,
          id_card,
          house_no,
          moo,
          village,
          road,
          soi,
          subdistrict,
          district,
          province,
          zipcode,
          phone,
          gender,
          academic_year,
          round,
          cost_option,
          price,
          height,
          weight
        ]
      );
    }

    // ✅ Update regist_status และ consent_given
    await client.query(
      `UPDATE tb_student 
       SET regist_status = 'รอชำระค่าลงทะเบียน', 
           consent_given = $2 
       WHERE std_code = $1`,
      [std_code, consent === true || consent === "true"]
    );

    client.release();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register API Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
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
      `SELECT r.*, s.* ,
       FROM tb_regist r
       JOIN tb_student s ON r.std_code = s.std_code
       WHERE r.std_code = $1`,
      [std_code]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการลงทะเบียน" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("GET regist error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
