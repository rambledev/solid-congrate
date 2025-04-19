"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Graduate = {
  studentId: string;
  name: string;
  faculty: string;
  major: string;
};

export default function Home() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [results, setResults] = useState<Graduate[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const dummyData: Graduate[] = [
      {
        studentId: "6401122334455",
        name: "สมชาย ใจดี",
        faculty: "ครุศาสตร์",
        major: "การศึกษาปฐมวัย",
      },
      {
        studentId: "6402233445566",
        name: "สมหญิง ศรีสุข",
        faculty: "วิทยาการคอมพิวเตอร์",
        major: "เทคโนโลยีสารสนเทศ",
      },
    ];

    setResults(dummyData);
    setIsSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-red-900 text-white pb-20">
      {/* Header Banner */}
      <div className="text-center p-6 bg-green-800">
        <Image
          src="/logo-100-ปี-rmu.png"
          alt="RMU Logo"
          width={120}
          height={120}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold mt-4">CONGRATE</h1>
        <p className="text-lg">ระบบลงทะเบียนรับปริญญา</p>
      </div>

      {/* 2-Column Section */}
      <div className="max-w-7xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel 1: Search */}
        <div className="bg-white p-6 rounded shadow-md text-black">
          <form onSubmit={handleSearch} className="space-y-4">
            <h2 className="text-xl font-semibold text-green-800 text-center mb-4">
              ค้นหารายชื่อนักศึกษา
            </h2>
            <input
              type="text"
              placeholder="รหัสนักศึกษา"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ชื่อ - สกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="ปีการศึกษาที่จบ (เช่น 2566)"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {/* Panel 2: ขั้นตอน */}
        <div className="bg-white p-6 rounded shadow-md text-black">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-green-800 text-center mb-4">
              ขั้นตอนการลงทะเบียนรับปริญญา
            </h2>
            <ol className="list-decimal pl-6 text-gray-800 space-y-2">
              <li>เข้าสู่ระบบด้วยรหัสนักศึกษา</li>
              <li>กรอกข้อมูลส่วนตัวให้ครบถ้วน</li>
              <li>เลือกวันและรอบฝึกซ้อม</li>
              <li>อัปโหลดเอกสารที่จำเป็น</li>
              <li>ตรวจสอบสถานะการอนุมัติ</li>
              <li>รับ QR Code สำหรับวันพิธีจริง</li>
              <li>นำ QR Code ไปแสดงหน้างาน</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Panel 3: ผลการค้นหา */}
      <AnimatePresence>
        {isSearched && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto mt-10 px-4"
          >
            <div className="bg-white p-6 rounded shadow-md text-black">
              <h3 className="text-xl font-bold text-green-800 text-center mb-4">
                ผลการค้นหา
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto bg-white text-black rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-green-800 text-white">
                    <tr>
                      <th className="py-2 px-4">รหัสนักศึกษา</th>
                      <th className="py-2 px-4">ชื่อ - สกุล</th>
                      <th className="py-2 px-4">คณะ</th>
                      <th className="py-2 px-4">สาขา</th>
                      <th className="py-2 px-4 text-center">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((grad, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-100 transition"
                      >
                        <td className="py-2 px-4">{grad.studentId}</td>
                        <td className="py-2 px-4">{grad.name}</td>
                        <td className="py-2 px-4">{grad.faculty}</td>
                        <td className="py-2 px-4">{grad.major}</td>
                        <td className="py-2 px-4 text-center">
                          <a
                            href={`/detail/${grad.studentId}`}
                            className="inline-block bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                          >
                            รายละเอียด
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
