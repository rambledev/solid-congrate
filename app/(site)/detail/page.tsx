"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function DetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showFixComment, setShowFixComment] = useState(false);


  const [stdCodeReady, setStdCodeReady] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [formStdCode, setFormStdCode] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const formatThaiDateDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear() + 543;
    return `${day}-${month}-${year}`;
  };

  // ตรวจสอบ session + std_code เมื่อหน้าโหลด
  useEffect(() => {
    const std_code = searchParams.get("std_code");
    if (!std_code) {
      setErrorMsg("ไม่พบรหัสบัณฑิตใน URL");
      setLoading(false);
      return;
    }

    const sessionStdCode = sessionStorage.getItem("std_code");

    if (!sessionStdCode || sessionStdCode !== std_code) {
      console.log("Session ไม่ตรงหรือหมดอายุ, เคลียร์และบังคับ login");
      sessionStorage.clear();
      localStorage.removeItem("std_code");
      setFormStdCode(std_code);
      setShowLogin(true);
      setLoading(false);
    } else {
      console.log("Session ตรง, โหลดข้อมูลทันที");
      setStdCodeReady(std_code);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!stdCodeReady) return;
    fetchStudent(stdCodeReady);
  }, [stdCodeReady]);

  const fetchStudent = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/student?std_code=${code}`);
      const data = await res.json();
      if (data.success) {
        setStudent(data.data);
      } else {
        setErrorMsg(data.message || "ไม่พบข้อมูลบัณฑิต");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      student?.fix_comment &&
      student.fix_comment.trim() !== "" &&
      student.fix_comment.trim() !== "ดำเนินการครบถ้วน"
    ) {
      setShowFixComment(true);
    }
    
  }, [student]);
  
  

  const handleLogin = async () => {
    if (!formStdCode || !password) {
      Swal.fire("โปรดกรอกรหัสและรหัสผ่าน", "", "warning");
      return;
    }
    setIsSubmittingPassword(true);
    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ std_code: formStdCode, password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("std_code", formStdCode);
        localStorage.setItem("std_code", formStdCode);
        setShowLogin(false);
        setStdCodeReady(formStdCode);
      } else {
        Swal.fire("เข้าสู่ระบบไม่สำเร็จ", data.message, "error");
      }
    } catch {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("std_code");
    router.push("/");
  };

  const handleUploadPhoto = () => {
    if (student?.std_code) {
      router.push(`/photo?std_code=${student.std_code}`);
    }
  };

  const handleSurvey = () => {
    router.push(`/survey?std_code=${student.std_code}`);
  };

  const handleRegister = () => {
    if (student.work_status === "ยังไม่เพิ่มข้อมูล") {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกแบบสอบถาม",
        text: "คุณต้องกรอกแบบสอบถามการมีงานทำก่อน จึงจะสามารถลงทะเบียนได้",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    router.push(`/register?std_code=${student.std_code}`);
  };

  const handlePaymentPrint = () => {
    if (student?.std_code) {
      router.push(`/payment?std_code=${student.std_code}`);
    }
  };

  const steps = [
    { label: "อัปโหลดรูปประจำตัว", done: true },
    { label: "อัปเดทข้อมูลส่วนตัว", done: true },
    {
      label: "กรอกแบบสอบถามการมีงานทำ",
      done: student?.work_status ? !student.work_status.includes("ยังไม่") : false,
    },
    {
      label: "ลงทะเบียนเข้ารับปริญญาบัตร",
      done: student?.regist_status === "ลงทะเบียนแล้ว",
    },
    { label: "ชำระเงิน", done: false },
  ];

  return (
    <main className="min-h-screen px-4 sm:px-8 py-10 bg-gradient-to-b from-green-900 to-red-900 text-white relative">
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div className="bg-white text-green-900 px-8 py-6 rounded shadow text-center">
              ⏳ กำลังโหลดข้อมูล...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFixComment && (
  <div className="fixed top-0 left-0 w-full z-[9999] bg-yellow-300 text-black px-4 py-3 flex justify-between items-center shadow">
    <span className="text-sm font-semibold">! แจ้งเตือนจาก Admin : <br />{student.fix_comment}</span>
    <button
      onClick={() => setShowFixComment(false)}
      className="ml-4 text-black font-bold hover:text-red-500"
    >
      ✖
    </button>
  </div>
)}


      <Banner />

      {/* 🟨 Login Modal */}
      {!loading && showLogin && (
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold text-green-700 mb-4">เข้าสู่ระบบยืนยันตัวตน</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">รหัสบัณฑิต</label>
                <input
                  type="text"
                  value={formStdCode}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mt-4"
              >
                {isSubmittingPassword ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && errorMsg && (
        <p className="text-center text-red-400 mt-10">{errorMsg}</p>
      )}

      {!loading && student && !showLogin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* 🟩 Card: สถานะรวม */}
        <div className="bg-white text-black rounded-lg shadow p-4 md:col-span-2">
          <h3 className="text-lg font-bold text-green-800 mb-4">สถานะรวมทุกขั้นตอน</h3>
          <div className="flex flex-col sm:flex-row justify-between items-center relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center w-full sm:w-1/5 mb-4 sm:mb-0 relative">
                {/* เส้นเชื่อม */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 right-0 w-full h-1 bg-gray-300 z-0"></div>
                )}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow ${
                    step.done ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-center text-[10px] sm:text-xs mt-1">{step.label}</p>
              </div>
            ))}
          </div>
        </div>
      
        {/* 🟩 Card: 1️⃣ อัปโหลดรูปประจำตัว */}
        <div className="bg-white text-black rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-green-800 mb-4">1️⃣ อัปโหลดรูปประจำตัว</h3>
          <div className="flex flex-col items-center">
            <img
              src={student.img ? `/uploads/${student.img}` : "/blank.png"}
              alt="student profile"
              className="w-[150px] h-[200px] object-cover rounded-md border border-green-700 shadow"
              onError={(e) => {
                e.currentTarget.src = "/blank.png";
              }}
            />
            <span className="text-red-500 mt-2 text-xs">*รูปภาพจะนำไปใช้ทำบัตรประจำตัว</span>
            <button
              onClick={handleUploadPhoto}
              className="w-40 mt-4 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-semibold"
            >
              📷 อัปโหลดรูปภาพ
            </button>
          </div>
        </div>
      
        {/* 🟩 Card: 2️⃣ ข้อมูลส่วนตัว */}
        <div className="bg-white text-black rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-green-800 mb-4">2️⃣ ข้อมูลส่วนตัว</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>รหัสบัณฑิต:</strong> {student.std_code}</p>
            <p><strong>ชื่อ - สกุล:</strong> {student.name_th}</p>
            <p><strong>ชื่อภาษาอังกฤษ:</strong> {student.name_en}</p>
            <p><strong>วันเกิด:</strong> {formatThaiDateDDMMYYYY(student.birthdate)}</p>
            <p><strong>คณะ:</strong> {student.faculty}</p>
            <p><strong>สาขา:</strong> {student.program}</p>
            <p><strong>GPA:</strong> {student.gpa}</p>
            <p><strong>จังหวัด:</strong> {student.province}</p>
          </div>
        </div>
      
        {/* 🟩 Card: 3️⃣ แบบสอบถามการมีงานทำ */}
        <div className="bg-white text-black rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-green-800 mb-4">3️⃣ แบบสอบถามการมีงานทำ</h3>
          <p
            className={`font-semibold mb-2 ${
              student.work_status?.includes("ยังไม่") ? "text-red-600" : "text-green-800"
            }`}
          >
            สถานะ: {student.work_status || "-"}
          </p>
          <button
            onClick={handleSurvey}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded font-semibold"
          >
            📝 กรอกแบบสอบถาม
          </button>
        </div>
      
        {/* 🟩 Card: 4️⃣ การลงทะเบียนเข้ารับปริญญาบัตร */}
        <div className="bg-white text-black rounded-lg shadow p-4">
          <h3 className="text-lg font-bold text-green-800 mb-4">4️⃣ การลงทะเบียนเข้ารับปริญญาบัตร</h3>
          <p
            className={`font-semibold mb-2 ${
              student.regist_status?.includes("ยังไม่") ? "text-red-600" : "text-green-800"
            }`}
          >
            สถานะ: {student.regist_status || "-"}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRegister}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
            >
              🖊️ ลงทะเบียน
            </button>
      
            {student.regist_status === "ลงทะเบียนแล้ว" && (
              <button
                onClick={handlePaymentPrint}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
              >
                🧾 พิมพ์ใบชำระเงิน
              </button>
            )}
          </div>
        </div>
      
        {/* 🟥 Logout Button */}
        <div className="md:col-span-2 flex justify-center">
          <button
            onClick={handleLogout}
            className="w-60 mt-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
      
      )}
    </main>
  );
}
