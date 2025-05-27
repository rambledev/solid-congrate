"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});


export default function DetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const [showFixComment, setShowFixComment] = useState(false);

  const [wishTitle, setWishTitle] = useState("");
const [wishUniform, setWishUniform] = useState("");


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

        console.log("data student std_code = "+data.data);
        console.log("data student std_code wish_title = "+data.wish_title);
        console.log("data student std_code wish_uniform = "+data.wish_uniform);


        setStudent(data.data);
        setWishTitle(data.data.wish_title || "");
  setWishUniform(data.data.wish_uniform || "");
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


    const fetchWish = async () => {
      if (!student?.std_code) return; // ✅ ป้องกัน undefined
      try {
        const res = await fetch(`/api/regist/wish?std_code=${student.std_code}`);
        const data = await res.json();
        if (data.success) {
          setWishTitle(data.data.wish_title || "");
          setWishUniform(data.data.wish_uniform || "");
        }
      } catch (err) {
        console.error("โหลดข้อมูล wish ล้มเหลว", err);
      }
    };
    
    const fetchUploadedFiles = async () => {
      if (!student?.std_code) return;
    
      try {
        const res = await fetch(`/api/docs?std_code=${student.std_code}`);
        const data = await res.json();
        if (data.success) {
          setUploadedFiles(data.files);
        }
      } catch (err) {
        console.error("โหลดไฟล์แนบล้มเหลว", err);
      }
    };
    
    
    // เรียกใช้หลังโหลด student
    if (student?.std_code) {
      fetchWish();
      fetchUploadedFiles();
    }
    


  }, [student]);

  const updateWish = async () => {
    const res = await fetch("/api/regist/wish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        std_code: student?.std_code,
        wish_title: wishTitle,
        wish_uniform: wishUniform,
      }),
    });
  
    const data = await res.json();
    if (data.success) {
      Swal.fire("บันทึกสำเร็จ", "", "success");
    } else {
      Swal.fire("เกิดข้อผิดพลาด", data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };
  
  const handleUploadFiles = async () => {
    if (!student?.std_code || selectedFiles.length === 0) {
      Swal.fire("กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์", "", "warning");
      return;
    }
  
    const formData = new FormData();
    formData.append("std_code", student.std_code);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
  
    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      if (data.success) {
        Toast.fire({ icon: "success", title: "อัปโหลดไฟล์เรียบร้อยแล้ว" });
        setSelectedFiles([]);
        // โหลดใหม่หลังอัปโหลด
        const res = await fetch(`/api/docs?std_code=${student.std_code}`);
        const updated = await res.json();
        if (updated.success) setUploadedFiles(updated.files);
      } else {
        Toast.fire({ icon: "error", title: data.message || "ไม่สามารถอัปโหลดได้" });
      }
    } catch (err) {
      console.error("upload error", err);
      Toast.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการอัปโหลด" });
    }
  };
  
  const handleDeleteFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/docs?id=${fileId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        Toast.fire({ icon: "success", title: "ลบไฟล์เรียบร้อยแล้ว" });
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        Toast.fire({ icon: "error", title: data.message || "ไม่สามารถลบไฟล์ได้" });
      }
    } catch (err) {
      console.error("delete error", err);
      Toast.fire({ icon: "error", title: "เกิดข้อผิดพลาดในการลบ" });
    }
  };
  
  
  const handleSaveWishes = async () => {
    try {
      const res = await fetch("/api/regist/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          std_code: student.std_code,
          wish_title: wishTitle,
          wish_uniform: wishUniform,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        Swal.fire("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว", "success");
      } else {
        Swal.fire("ผิดพลาด", data.message, "error");
      }
    } catch (err) {
      console.error("Save wish error:", err);
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };
  

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

  const handleEditProfile = () => {
    if (student?.std_code) {
      router.push(`/profile?std_code=${student.std_code}`);
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

  {/* 🟢 ข้อมูลบัณฑิต */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
    <p><strong>รหัสบัณฑิต:</strong> {student.std_code}</p>
    <p><strong>ชื่อ - สกุล:</strong> {student.name_th}</p>
    <p><strong>วุฒิปริญญา:</strong> {student.fac_type}</p>
    <p><strong>ลำดับปริญญา:</strong> {student.fix_num}</p>
    <p><strong>คณะ:</strong> {student.faculty}</p>
    <p><strong>สาขา:</strong> {student.program}</p>
    <p><strong>Email:</strong> {student.email}</p>
  </div>

  {/* 🟩 ความประสงค์ + แนบไฟล์ แบ่ง 2 คอลัมน์ */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* ซ้าย: ความประสงค์ */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">ความประสงค์คำนำหน้า</label>
      <input
        type="text"
        value={wishTitle}
        onChange={(e) => setWishTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded text-black"
        placeholder="เช่น ว่าที่ร้อยตรี"
      />

      <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">ความประสงค์การแต่งกาย</label>
      <input
        type="text"
        value={wishUniform}
        onChange={(e) => setWishUniform(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded text-black"
        placeholder="เช่น เต็มยศ"
      />
    </div>

    {/* ขวา: แนบไฟล์ */}
    <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    แนบหลักฐาน (เลือกได้หลายไฟล์พร้อมกัน)
  </label>
  <input
    type="file"
    multiple
    onChange={handleFileChange}
    className="block w-full text-sm text-white
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-700 file:text-white
              hover:file:bg-green-800"
  />

  {/* รายชื่อไฟล์ที่เลือก */}
  {selectedFiles.length > 0 && (
    <ul className="mt-2 list-disc list-inside text-sm text-black">
      {selectedFiles.map((file, idx) => (
        <li key={idx}>{file.name}</li>
      ))}
    </ul>
  )}

  {/* ปุ่มอัปโหลด เฉพาะเมื่อเลือกไฟล์ */}
  {selectedFiles.length > 0 && (
    <button
      onClick={handleUploadFiles}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
    >
      📎 อัปโหลดไฟล์
    </button>
  )}

  {/* รายชื่อไฟล์ที่เคยแนบ */}
  {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-medium text-gray-700 mb-1">ไฟล์ที่แนบแล้ว:</p>
    <ul className="text-sm text-black space-y-1">
      {uploadedFiles.map((file: any, idx) => (
        <li
          key={file?.id || idx}
          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
        >
          <span className="truncate">{file?.original_name || "ไม่ทราบชื่อไฟล์"}</span>
          <button
            onClick={() => handleDeleteFile(file?.id)}
            className="ml-4 text-red-600 hover:text-red-800 font-bold"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>


  </div>

  {/* ปุ่มบันทึก */}
  <div className="mt-6 text-center">
    <button
      onClick={handleSaveWishes}
      className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-2 rounded"
    >
      💾 บันทึกความประสงค์
    </button>
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
      
            {student.regist_status === "รอชำระค่าลงทะเบียน" && (
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
