'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import Banner from '@/components/Banner';

const defaultData = {
  name: '-',
  stdCode: '-',
  level: '-',
  degree: '-',
  description: '-',
  detail: '-',
  amount: 0,
  amountText: 'ศูนย์บาทถ้วน',
  dueDateRange: '15 มกราคม 2561 - 5 มีนาคม 2561',
  printDate: new Date().toLocaleString('th-TH'),
  accountNo: '476-6-00126-5',
  comCode: '80356',
  barcode: '-',
  ref1: '-',
  ref2: '-',
  height: null,
  weight: null,
};

export default function PaymentPage() {
  const [data, setData] = useState(defaultData);
  const router = useRouter();
  const { Canvas } = useQRCode();

  useEffect(() => {
    const std_code = sessionStorage.getItem('std_code');
    if (!std_code) return;

    fetch(`/api/payment/${std_code}`)
      .then((res) => res.json())
      .then((apiData) => setData({ ...defaultData, ...apiData }))
      .catch(() => setData(defaultData));
  }, []);

  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen px-6 py-10 bg-green-900 text-gray-800">
      <div className="print:hidden">
    <Banner />
  </div>

      <div className="max-w-[794px] mx-auto bg-white p-6 rounded shadow print:shadow-none print:p-0 print:bg-white">
        {/* ปุ่มย้อนกลับ */}
        <div className="mb-4 print:hidden">
          <button
            onClick={() => router.push(`/detail?std_code=${data.stdCode}`)}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-6 py-2 rounded"
          >
            ← กลับหน้ารายละเอียด
          </button>
        </div>

        {/* พื้นที่พิมพ์ */}
        <div
          id="pdf-area"
          className="text-[13px] leading-snug text-black print:h-[1122px] print:overflow-hidden"
        >
          {/* ส่วนที่ 1 */}
          <div className="border border-black p-4 mb-2">
            <div className="text-center font-bold text-base mb-1">ใบแทนใบสำคัญรับเงิน</div>
            <p className="text-center text-xs mb-2">( แต่ไม่สามารถนำไปเบิกค่าใช้จ่ายทางราชการได้ )</p>

            <div className="flex justify-between text-sm mb-4">
              <div>
                <Image src="/logo-wb.png" alt="logo" width={70} height={70} className="mb-2" />
                <p className="font-bold">มหาวิทยาลัยราชภัฏมหาสารคาม</p>
                <p>ใบแจ้งชำระเงินค่าสาระทะเบียนบัณฑิต</p>
                <p className="mt-2">ชื่อ - สกุล: {data.name}</p>
                <p>ระดับการศึกษา: {data.level}</p>
                {data.height && <p>ส่วนสูง: {data.height} ซม.</p>}
                {data.weight && <p>น้ำหนัก: {data.weight} กก.</p>}
              </div>
              <div className="text-right">
                <p>พิมพ์เมื่อ: {data.printDate}</p>
                <p>รหัสนักศึกษา: {data.stdCode}</p>
                <p>วุฒิการศึกษา: {data.degree}</p>
              </div>
            </div>

            <table className="w-full border border-black text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-2 py-1 w-[40px]">ที่</th>
                  <th className="border border-black px-2 py-1 text-left">รายการ</th>
                  <th className="border border-black px-2 py-1 w-[140px] text-right">
                    จำนวนเงิน<br />Amount(Baht)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black px-2 py-1 text-center align-top">1</td>
                  <td className="border border-black px-2 py-1">
                    {data.description}<br />- {data.detail}
                  </td>
                  <td className="border border-black px-2 py-1 text-right align-top">
                    {data.amount?.toFixed(2) || '0.00'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black px-2 py-1 text-right font-bold">
                    {data.amountText}
                  </td>
                  <td className="border border-black px-2 py-1 text-right font-bold">
                    {data.amount?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mb-2">กำหนดชำระเงิน ภายในวันที่ {data.dueDateRange}</p>

            <div className="flex justify-between">
              <div className="text-sm">
                <p>( สำหรับเจ้าหน้าที่ที่รับเงิน )</p>
                <p>ผู้รับเงิน: ..........................................</p>
                <p>วันที่: ......../......../..........</p>
                <p>( ลงลายมือชื่อและประทับตรา )</p>
              </div>
              <div className="text-right italic text-sm">(พับ ติดตามรอยประ)</div>
            </div>

            <p className="mt-2 text-xs italic">
              ( เก็บเอกสารนี้ไว้เป็นหลักฐานการชำระเงิน ) เพื่อความสะดวกของท่าน กรุณานำเอกสารฉบับนี้ไปชำระเงินได้ที่ธนาคารที่มีรายชื่อ ทุกสาขาทั่วประเทศ
            </p>
          </div>

          {/* ส่วนที่ 2 */}
          <div className="border border-black p-4">
            <div className="flex justify-between mb-2">
              <div className="flex gap-4">
                <Image src="/logo-wb.png" alt="logo" width={70} height={70} className="mb-2" />
                <div>
                  <p className="font-bold">มหาวิทยาลัยราชภัฏมหาสารคาม</p>
                  <p>เลขที่ 80 ถนนนครสวรรค์ อ.เมือง จ.มหาสารคาม 44000</p>
                  <p className="mt-1">ธนาคารกรุงไทย {data.accountNo} COM CODE {data.comCode}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">ใบแจ้งการชำระเงิน (เพื่อนำเข้าบัญชี)</p>
                <p className="text-xs">( โปรดเรียกเก็บค่าธรรมเนียมจากผู้ชำระเงิน )</p>
              </div>
            </div>

            <div className="border border-black p-3">
              <p>กำหนดชำระเงิน ภายในวันที่ {data.dueDateRange}</p>
              <p>ชื่อ / Name : {data.name}</p>
              <p>รหัสนักศึกษา / Ref No.1 : {data.ref1}</p>
              <p>เลขที่อ้างอิง / Ref No.2 : {data.ref2}</p>
              <p className="mt-2">** ค่าธรรมเนียมผ่านธนาคาร ** 10 บาท ทั่วประเทศ</p>
              <p>จำนวนเงิน: {data.amount?.toFixed(2) || '0.00'} บาท</p>
              <p>จำนวนเงินอักษร: {data.amountText}</p>
              <div className="flex justify-between mt-4">
                <div>
                  <p>ผู้รับเงิน / Received By ....................................</p>
                  <p>ผู้มอบอำนาจ / Received By ................................</p>
                </div>
                <div className="text-right">
                  <p>ชื่อผู้นำฝาก / เบอร์โทร ....................................</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center mt-4">
              <div className="text-center">
                <div className="bg-black h-6 w-72 mb-1" />
                <p className="tracking-widest font-mono font-bold">{data.barcode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่ม print (ไม่แสดงตอนพิมพ์) */}
        <div className="mt-6 print:hidden text-right">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🖨️ พิมพ์ใบแจ้งชำระเงิน
          </button>
        </div>
      </div>
    </main>
  );
}
