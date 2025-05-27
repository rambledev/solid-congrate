// app/cio/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CIOPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ตรวจสอบ session เมื่อเข้าหน้า
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    console.log("🔍 ตรวจสอบ CIO session...");
    
    try {
      const userData = localStorage.getItem("cio_user");
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // ตรวจสอบว่าเป็น CIO และข้อมูลถูกต้อง
        if (parsedUser.role === "cio" && parsedUser.id && parsedUser.name) {
          console.log("✅ พบ CIO session ที่ถูกต้อง - redirect ไป dashboard");
          router.push("/cio/dashboard");
          return;
        } else {
          console.log("❌ Session ไม่ถูกต้อง - ล้างข้อมูล");
          localStorage.removeItem("cio_user");
        }
      } else {
        console.log("❌ ไม่พบ session");
      }
    } catch (error) {
      console.error("💥 Error parsing session:", error);
      localStorage.removeItem("cio_user");
    }

    console.log("📋 แสดงหน้า login");
    setShowLogin(true);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError("");

    try {
      console.log("🔐 ทำการ login CIO...");
      
      const response = await fetch("/api/member/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          expectedRole: "cio",
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.role !== "cio") {
          setError("คุณไม่มีสิทธิ์เข้าถึงระบบ CIO");
          return;
        }

        console.log("✅ Login CIO สำเร็จ");
        localStorage.setItem("cio_user", JSON.stringify(result.data));
        router.push("/cio/dashboard");
      } else {
        setError(result.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoginLoading(false);
    }
  };

  // Loading screen ขณะตรวจสอบ session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // แสดงหน้า login เมื่อไม่มี session
  if (!showLogin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            CIO Login
          </h1>
          <p className="text-gray-600">
            เข้าสู่ระบบสำหรับ Chief Information Officer
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="กรอกชื่อผู้ใช้"
              disabled={loginLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="กรอกรหัสผ่าน"
              disabled={loginLoading}
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading || !formData.name || !formData.password}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loginLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังเข้าสู่ระบบ...
              </div>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            สำหรับผู้ดูแลระบบเท่านั้น
          </p>
        </div>
      </div>
    </div>
  );
}