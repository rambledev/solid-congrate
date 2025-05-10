import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const { std_code, comment, student_email } = await req.json()

  if (!std_code || !comment || !student_email) {
    return NextResponse.json(
      { success: false, message: 'std_code, comment, และ student_email เป็นข้อมูลที่จำเป็น' },
      { status: 400 }
    )
  }

  try {
    // 1️⃣ อัปเดต fix_comment ใน tb_student
    await pool.query('UPDATE tb_student SET fix_comment = $1 WHERE std_code = $2', [comment, std_code])

    // 2️⃣ สร้าง Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // ใช้ SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // 3️⃣ ส่งอีเมลแจ้งนักศึกษา
    await transporter.sendMail({
      from: `"ระบบรับปริญญา มหาวิทยาลัยราชภัฏมหาสารคาม" <${process.env.SMTP_USER}>`,
      to: student_email, // อีเมลนักศึกษา
      subject: 'แจ้งเตือนจากระบบรับปริญญา',
      text: comment,
      html: `<p>${comment}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Database or email error:', err)
    return NextResponse.json({ success: false, message: 'Database or email error' }, { status: 500 })
  }
}
