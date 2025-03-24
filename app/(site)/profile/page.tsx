"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    std_code: "",
    faculty: "",
    program: "",
    phone: "",
    password: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      // สมมติว่า user มีข้อมูลตามที่ระบุไว้
      setUserInfo({
        name: user.name || "",
        std_code: user.std_code || "",
        faculty: user.faculty || "",
        program: user.program || "",
        phone: user.phone || "",
        password: "", // ไม่ต้องแสดงรหัสผ่านในฟอร์ม
      });
    } else {
      router.push("/login"); // ถ้าผู้ใช้ไม่ได้ล็อกอิน ให้ส่งไปหน้า login
    }
  }, [router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/update', userInfo);
      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : "An error occurred");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/change-password', { password: newPassword });
      if (response.data.success) {
        setSuccessMessage("Password changed successfully!");
        setNewPassword(""); // รีเซ็ตฟิลด์รหัสผ่านใหม่
      } else {
        setErrorMessage(response.data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : "An error occurred");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="my-4">
        <input
          type="text"
          placeholder="Name"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Student Code"
          value={userInfo.std_code}
          onChange={(e) => setUserInfo({ ...userInfo, std_code: e.target.value })}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Faculty"
          value={userInfo.faculty}
          onChange={(e) => setUserInfo({ ...userInfo, faculty: e.target.value })}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Program"
          value={userInfo.program}
          onChange={(e) => setUserInfo({ ...userInfo, program: e.target.value })}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone"
          value={userInfo.phone}
          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </form>

      {/* Change Password Form */}
      <h2 className="text-xl font-bold mt-8">Change Password</h2>
      <form onSubmit={handleChangePassword} className="my-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-3 p-2 border border-gray-300 rounded w-full"
          required
        />
        <button
          type="submit"
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Change Password
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      </form>
    </main>
  );
};

export default Profile;