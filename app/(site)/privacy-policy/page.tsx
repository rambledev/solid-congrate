"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-green-900 text-gray-800 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">

        {/* 🔙 ปุ่มย้อนกลับ */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            ย้อนกลับ
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </h1>

        <section className="space-y-4 text-base leading-relaxed">
          <p>
            ศูนย์เทคโนโลยีดิจิทัลและนวัตกรรม มหาวิทยาลัยราชภัฏมหาสารคาม ตระหนักถึงความสำคัญของข้อมูลส่วนบุคคล
            และมุ่งมั่นในการคุ้มครองข้อมูลของนักศึกษาที่ใช้งานระบบลงทะเบียนเข้ารับพระราชทานปริญญาบัตร
          </p>

          <h2 className="text-xl font-semibold text-green-700 mt-6">1. ข้อมูลที่เก็บรวบรวม</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>รหัสนักศึกษา, ชื่อ-นามสกุล, ชื่อภาษาอังกฤษ</li>
            <li>วันเดือนปีเกิด, ระดับการศึกษา, GPA, คณะ, สาขา</li>
            <li>ที่อยู่: บ้านเลขที่, หมู่, หมู่บ้าน, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์</li>
            <li>เบอร์โทรศัพท์, เพศ, ปีการศึกษา, เลือกค่าใช้จ่าย และรูปถ่าย</li>
            <li>สถานะการลงทะเบียน และสถานะการยินยอม (consent_given)</li>
          </ul>

          <h2 className="text-xl font-semibold text-green-700 mt-6">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>จัดการข้อมูลและตรวจสอบสิทธิ์ในการเข้ารับพระราชทานปริญญาบัตร</li>
            <li>ใช้ในขั้นตอนการลงทะเบียน และตรวจสอบข้อมูลที่เกี่ยวข้องกับการเข้าร่วมพิธี</li>
            <li>จัดทำรายงานและแสดงสถานะการลงทะเบียน</li>
          </ul>

          <h2 className="text-xl font-semibold text-green-700 mt-6">3. การเปิดเผยข้อมูล</h2>
          <p>
            ระบบจะแสดงข้อมูลบางส่วนสู่สาธารณะ ได้แก่:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>รหัสนักศึกษา</li>
            <li>ชื่อ-นามสกุล</li>
            <li>คณะ</li>
            <li>สาขาวิชา</li>
          </ul>

          <h2 className="text-xl font-semibold text-green-700 mt-6">4. การจัดเก็บและความปลอดภัยของข้อมูล</h2>
          <p>
            ข้อมูลของนักศึกษาถูกจัดเก็บไว้ในฐานข้อมูลภายใต้เซิร์ฟเวอร์ของมหาวิทยาลัย  
            โดยมีการเข้ารหัสรหัสผ่านด้วย <span className="font-semibold">bcrypt</span>  
            และจำกัดการเข้าถึงไว้เฉพาะเจ้าหน้าที่ระดับ <span className="font-semibold">รองอธิการบดีฝ่ายเทคโนโลยีสารสนเทศ</span> ขึ้นไปเท่านั้น
          </p>

          <h2 className="text-xl font-semibold text-green-700 mt-6">5. สิทธิของเจ้าของข้อมูล</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>เข้าถึงและดูข้อมูลของตนเองได้หลังเข้าสู่ระบบ</li>
            <li>สามารถถอนความยินยอมได้โดยติดต่อเจ้าหน้าที่</li>
          </ul>
          <p>
            การถอนความยินยอมสามารถดำเนินการได้ที่  
            <a
              href="https://cc.rmu.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline ml-1"
            >
              ศูนย์เทคโนโลยีดิจิทัลและนวัตกรรม
            </a>
          </p>

          <h2 className="text-xl font-semibold text-green-700 mt-6">6. ช่องทางการติดต่อ</h2>
          <p>
            ศูนย์เทคโนโลยีดิจิทัลและนวัตกรรม  
            <br />
            มหาวิทยาลัยราชภัฏมหาสารคาม  
            <br />
            เว็บไซต์:{" "}
            <a
              href="https://cc.rmu.ac.th/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://cc.rmu.ac.th/
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
