import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { to, subject, text } = await req.json();

  if (!to || !subject || !text) {
    return NextResponse.json(
      { success: false, message: 'ต้องใส่ to, subject, และ text' },
      { status: 400 }
    );
  }

  // ตั้งค่า transporter สำหรับ Gmail + App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'graduatation@rmu.ac.th',         // ← Gmail มหาวิทยาลัย
      pass: 'eulfzueqrzdcgirm'                // ← App Password (16 ตัว, เขียนติดกัน)
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"RMU Graduation" <graduatation@rmu.ac.th>',  // ชื่อผู้ส่ง + email
      to,         // ผู้รับ (จาก body)
      subject,    // หัวข้อ
      text        // เนื้อหา plain text
    });

    console.log('Email sent:', info.response);

    return NextResponse.json({ success: true, message: 'ส่งอีเมลสำเร็จ', info });
  } catch (err) {
    console.error('Send mail error:', err);
    return NextResponse.json(
      { success: false, message: 'ส่งอีเมลไม่สำเร็จ', error: err },
      { status: 500 }
    );
  }
}
