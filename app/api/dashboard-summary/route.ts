import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();

    // นักศึกษาทั้งหมด
    const totalStudentsRes = await client.query(`SELECT COUNT(*) FROM tb_student`);
    const totalStudents = Number(totalStudentsRes.rows[0].count);

    // ลงทะเบียนแล้ว
    const totalRegisteredRes = await client.query(`SELECT COUNT(*) FROM tb_regist`);
    const totalRegistered = Number(totalRegisteredRes.rows[0].count);

    // ส่งแบบสอบถามแล้ว
    const totalSurveyRes = await client.query(`SELECT COUNT(*) FROM tb_survey`);
    const totalSurvey = Number(totalSurveyRes.rows[0].count);

    // เช็คชื่อแล้ว
    const totalCheckinRes = await client.query(`SELECT COUNT(DISTINCT std_code) FROM tb_checklist`);
    const totalCheckin = Number(totalCheckinRes.rows[0].count);

    // ให้ consent
    const totalConsentRes = await client.query(`SELECT COUNT(*) FROM tb_student WHERE consent_given = true`);
    const totalConsent = Number(totalConsentRes.rows[0].count);

    // ผู้ที่ทำงานแล้ว
    const totalWorkingRes = await client.query(`SELECT COUNT(*) FROM tb_survey WHERE work_status = 'ทำงานแล้ว'`);
    const totalWorking = Number(totalWorkingRes.rows[0].count);

    client.release();

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalRegistered,
        totalSurvey,
        totalCheckin,
        totalConsent,
        totalWorking,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
