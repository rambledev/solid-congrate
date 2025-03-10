import React from 'react';
import Image from 'next/image';

const PaymentPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">ขั้นตอนการชำระเงิน</h1>
      <p className="mb-4">
        กรุณาทำตามขั้นตอนด้านล่างเพื่อทำการชำระเงิน:
      </p>

      <ol className="list-decimal ml-5 mb-6">
        <li>ตรวจสอบข้อมูลการลงทะเบียนของคุณให้ถูกต้อง</li>
        <li>เลือกวิธีการชำระเงินที่ต้องการ:</li>
        <ul className="list-disc ml-5">
          <li>บัตรเครดิต/เดบิต</li>
          <li>การโอนเงินผ่านธนาคาร</li>
          <li>ชำระเงินผ่านช่องทางออนไลน์ (e-wallets)</li>
        </ul>
        <li>กรอกข้อมูลการชำระเงินของคุณ</li>
        <li>ตรวจสอบความถูกต้องแล้วคลิก "ชำระเงิน"</li>
        <li>บันทึกหรือถ่ายภาพหลักฐานการชำระเงิน</li>
        <li>รอการยืนยันการชำระเงินจากทีมงาน</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-4">รายละเอียดการชำระเงิน</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-medium">หมายเลขบัญชีธนาคาร:</h3>
        <p>123-456-7890</p>
        <h3 className="font-medium">ชื่อบัญชี:</h3>
        <p>บริษัทของเรา</p>
        <h3 className="font-medium">ธนาคาร:</h3>
        <p>ธนาคาร ABC</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">ตัวอย่างการชำระเงิน:</h3>
      <Image
        src="/images/payment-sample.png" // แทนที่ด้วย path ที่ถูกต้อง
        alt="Payment Sample"
        width={500}
        height={300}
        className="rounded-lg mb-4"
      />

      <p className="text-red-600">
        หมายเหตุ: กรุณาตรวจสอบความถูกต้องของข้อมูลการชำระเงินก่อนการส่ง
      </p>
    </div>
  );
};

export default PaymentPage;