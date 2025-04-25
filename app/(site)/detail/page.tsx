// detail/page.tsx (Full version, fixed JSX error and includes all conditions)

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function DetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stdCodeReady, setStdCodeReady] = useState<string | null>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [formStdCode, setFormStdCode] = useState("");
  const [password, setPassword] = useState("");

  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const formatThaiDateDDMMYYYY = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear() + 543;
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const std_code = searchParams.get("std_code");
    const sessionStdCode = sessionStorage.getItem("std_code");

    if (!std_code) {
      setErrorMsg("ไม่พบรหัสบัณฑิตใน URL");
      setLoading(false);
      return;
    }

    if (!sessionStdCode && localStorage.getItem("std_code")) {
      sessionStorage.setItem("std_code", localStorage.getItem("std_code")!);
    }

    const updatedSession = sessionStorage.getItem("std_code");

    if (updatedSession === std_code) {
      setStdCodeReady(std_code);
    } else {
      setFormStdCode(std_code);
      setShowLogin(true);
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!stdCodeReady) return;
    fetchStudent(stdCodeReady);
  }, [stdCodeReady]);

  const fetchStudent = async (code: string) => {
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

  const handleLogin = async () => {
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
        setLoading(true);
        setStdCodeReady(formStdCode);
      } else {
        Swal.fire("เข้าสู่ระบบไม่สำเร็จ", data.message, "error");
      }
    } catch {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
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

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length > 10) {
      Swal.fire("ข้อผิดพลาด", "กรุณากรอกรหัสผ่านใหม่ไม่เกิน 10 ตัวอักษร", "warning");
      return;
    }

    try {
      setIsSubmittingPassword(true);
      const res = await fetch("/api/student/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ std_code: stdCodeReady, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setShowPasswordReset(false);
        setNewPassword("");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire("ผิดพลาด", data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้", "error");
      }
    } catch {
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <>
      <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-green-900 to-red-900 text-white relative">
        <AnimatePresence>
          {loading && (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div className="bg-white text-green-900 px-8 py-6 rounded shadow text-center">
                ⏳ กำลังโหลดข้อมูล...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLogin && (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div className="bg-white p-6 rounded shadow max-w-sm w-full border border-green-800 text-black relative">
                <h2 className="text-xl font-bold text-center text-green-800 mb-4">เข้าสู่ระบบ</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm text-green-800">รหัสนักศึกษา</label>
                    <input
                      value={formStdCode}
                      onChange={(e) => setFormStdCode(e.target.value)}
                      className="w-full border px-3 py-2 text-black border-green-800"
                      placeholder="รหัสนักศึกษา"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-green-800">รหัสผ่าน</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border px-3 py-2 text-black border-green-800"
                      placeholder="วันเดือนปีเกิด เช่น 20000101"
                    />
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                      ให้ใช้ วันเดือนปีเกิด ของคุณในการ Login ครั้งแรก<br />ตัวอย่าง: 20000101 = 1 ม.ค. 2000
                    </p>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleLogin}
                      className="bg-green-800 hover:bg-green-900 text-white font-semibold px-6 py-2 rounded"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Banner />

        {!loading && errorMsg && (
          <p className="text-center text-red-400 mt-10">{errorMsg}</p>
        )}

        {!loading && student && (
          <div className="max-w-3xl mx-auto bg-white text-black p-6 rounded shadow mt-10">
            <div className="flex flex-col items-center mb-6">
              <img
                src={student.img ? `/uploads/${student.img}` : "/blank.png"}
                alt="student profile"
                className="w-40 h-40 object-cover rounded-md border border-green-700 shadow"
              />

              <button
                onClick={handleUploadPhoto}
                className="w-60 mt-4 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-semibold"
              >
                📷 อัปโหลดรูปภาพ
              </button>
              

              

              <button
                onClick={() => setShowPasswordReset(true)}
                className="w-60 mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold"
              >
                🔐 เปลี่ยนรหัสผ่าน
              </button>

              {showPasswordReset && (
                <div className="mt-4 w-full max-w-sm">
                  <p className="text-red-600 text-sm mb-1">
                    * กรุณากรอกรหัสผ่านใหม่ไม่เกิน 10 ตัวอักษร
                  </p>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-black border-green-700"
                    placeholder="รหัสผ่านใหม่"
                  />
                  <button
                    onClick={handleUpdatePassword}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                    disabled={isSubmittingPassword}
                  >
                    💾 บันทึกรหัสผ่าน
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-green-800 mb-4">ข้อมูลบัณฑิต</h2>
            <div className="space-y-2">
              <p><strong>รหัสบัณฑิต:</strong> {student.std_code}</p>
              <p><strong>ชื่อ - สกุล:</strong> {student.name_th}</p>
              <p><strong>ชื่อภาษาอังกฤษ:</strong> {student.name_en}</p>
              <p><strong>วันเกิด:</strong> {formatThaiDateDDMMYYYY(student.birthdate)}</p>
              <p><strong>คณะ:</strong> {student.faculty}</p>
              <p><strong>สาขา:</strong> {student.program}</p>
              <p><strong>GPA:</strong> {student.gpa}</p>
              <p><strong>จังหวัด:</strong> {student.province}</p>
              <p><strong>ศาสนา:</strong> {student.religion}</p>
              <p><strong>หมายเหตุ:</strong> {student.note || "-"}</p>

              <p className={`text-center font-bold ${student.regist_status?.includes("ยังไม่") ? "text-red-600" : "text-green-800"}`}>
                สถานะการลงทะเบียน: {student.regist_status || "-"}
              </p>

              <p className={`text-center font-bold ${student.work_status?.includes("ยังไม่") ? "text-red-600" : "text-green-800"}`}>
                สถานะข้อมูลการทำงาน: {student.work_status || "-"}
              </p>

              {student.work_status === "ยังไม่เพิ่มข้อมูล" && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleSurvey}
                    className="w-60 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                  >
                    📝 กรอกแบบสอบถาม
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
              <button
  onClick={handleRegister}
  className="w-60 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
>
  🖊️ ลงทะเบียน
</button>


                {student.regist_status === "ลงทะเบียนแล้ว" && (
                  <div className="mt-4">
                    <button
                      onClick={handlePaymentPrint}
                      className="w-60 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                    >
                      🧾 พิมพ์ใบชำระเงิน
                    </button>
                  </div>
                )}
<br />
<br />
<br />
<button
                onClick={handleLogout}
                className="w-60 mt-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
              >
                🚪 ออกจากระบบ
              </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 
