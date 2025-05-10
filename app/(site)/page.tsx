"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";

export default function Home() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/student/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          std_code: studentId,
          name_th: name,
          grad_year: gradYear,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setIsSearched(true);
      } else {
        setResults([]);
        alert("ไม่พบข้อมูลนักศึกษา");
      }
    } catch (err) {
      console.error("Search error:", err);
      alert("เกิดข้อผิดพลาดในการค้นหา");
    }
  };

  return (
    <main className="bg-gradient-to-b from-green-900 to-red-900 min-h-screen text-white px-4 py-8">
      {/* Header Banner Component */}
      <Banner />

      {/* Search Panel */}
      <div className="max-w-7xl mx-auto mt-10 px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow-md text-black">
          <h2 className="text-xl font-semibold text-green-800 text-center mb-4">
            ค้นหารายชื่อบัณฑิต
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
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
            {/* <input
              type="text"
              placeholder="ปีการศึกษาที่จบ (เช่น 2566)"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              className="w-full p-2 border rounded"
            /> */}
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded"
            >
              ค้นหา
            </button>
          </form>

          {/* Search Result Panel (แสดงผลลัพธ์ใต้ฟอร์มในมือถือ) */}
          {isSearched && (
            <div className="mt-6 block lg:hidden">
              <div className="bg-white p-4 rounded shadow-md text-black">
                <h3 className="text-lg font-bold text-green-800 text-center mb-4">
                  ผลการค้นหา
                </h3>
                {results.length > 0 ? (
                  <div className="space-y-4">
                  {results.map((student) => (
                    <div key={student.id} className="border border-green-700 rounded p-4 shadow">
                      <p className="text-sm"><strong>รหัส:</strong> {student.std_code}</p>
                      <p className="text-sm"><strong>ชื่อ:</strong> {student.name_th}</p>
                      <p className="text-sm"><strong>คณะ:</strong> {student.faculty}</p>
                      <p className="text-sm"><strong>สาขา:</strong> {student.program}</p>
                      <div className="mt-3 text-right">
                        <button
                          onClick={() => router.push(`/detail?std_code=${student.std_code}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        >
                          รายละเอียด
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                ) : (
                  <p className="text-center text-red-600">ไม่พบข้อมูลบัณฑิต</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Registration Steps Panel */}
        <div className="bg-white p-6 rounded shadow-md text-black">
          <h2 className="text-xl font-semibold text-green-800 text-center mb-4">
            ขั้นตอนการลงทะเบียนรับปริญญา
          </h2>
          <div className="space-y-3 text-gray-800">
            <p>
              ขอแสดงความยินดีกับบัณฑิตใหม่ทุกท่าน มหาวิทยาลัยราชภัฏมหาสารคาม ได้ใช้ระบบลงทะเบียนบัณฑิต
              เพื่อเข้ารับพระราชทานปริญญาบัตรในการเข้าร่วมพิธีฯ โดยมีวัตถุประสงค์เพื่อจัดระเบียบการรับสมัคร
              ตรวจสอบสถานะ และความถูกต้องของข้อมูลบัณฑิต
              โดยระบบจะเปิดให้ลงทะเบียนระหว่างวันที่ 15 มกราคม - 5 มีนาคม 2561
              โดยชำระเงินค่าลงทะเบียนเรียบร้อยแล้วเท่านั้นจึงถือว่าสมัครสำเร็จ
            </p>
            <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">
              <strong className="block text-blue-800 mb-1">ประกาศ</strong>
              <p>
                ** ประกาศมหาวิทยาลัยราชภัฏมหาสารคาม เรื่อง กำหนดอัตราค่าลงทะเบียนเข้ารับพระราชทานปริญญาบัตร 
                <a href="#" className="text-blue-700 underline ml-1" target="_blank">
                  มหาวิทยาลัยราชภัฏมหาสารคาม พ.ศ.2561
                </a>
              </p>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
              <strong className="block text-yellow-800 mb-1">คำชี้แจง *</strong>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>บัณฑิตจะต้องลงชื่อแบบสำรวจการเข้าร่วมพิธีฯ พร้อมชำระเงินเพื่อเข้ารับพระราชทานปริญญาบัตรได้</li>
                <li>บัณฑิตต้องสามารถตรวจสอบสถานะการชำระเงินและลงทะเบียนได้สำเร็จ ภายในระยะเวลา 7 วันทำการ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search Result Panel (แสดงผลลัพธ์สำหรับจอใหญ่) */}
      {isSearched && (
        <div className="max-w-7xl mx-auto mt-10 px-4 hidden lg:block">
          <div className="bg-white p-6 rounded shadow-md text-black">
            <h3 className="text-xl font-bold text-green-800 text-center mb-4">
              ผลการค้นหา
            </h3>
            {results.length > 0 ? (
              <table className="w-full table-auto bg-white text-black rounded-lg overflow-hidden shadow-md">
                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="py-2 px-4 text-center">รหัสนักศึกษา</th>
                    <th className="py-2 px-4 text-center">ชื่อ - สกุล</th>
                    <th className="py-2 px-4 text-center">คณะ</th>
                    <th className="py-2 px-4 text-center">สาขา</th>
                    <th className="py-2 px-4 text-center">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-100 transition">
                      <td className="py-2 px-4 text-center">{student.std_code}</td>
                      <td className="py-2 px-4 text-center">{student.name_th}</td>
                      <td className="py-2 px-4 text-center">{student.faculty}</td>
                      <td className="py-2 px-4 text-center">{student.program}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => router.push(`/detail?std_code=${student.std_code}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        >
                          รายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-red-600">ไม่พบข้อมูลบัณฑิต</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
