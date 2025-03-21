"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // ใช้ useRouter สำหรับ redirect
import FunFact from "@/components/FunFact";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      console.log("response data user", response.data.user);

      if (response.data.success) {
        // หากล็อกอินสำเร็จ คุณสามารถ redirect หรือทำอย่างอื่นที่คุณต้องการ เช่นเก็บข้อมูลผู้ใช้ใน localStorage
        // localStorage.setItem('user', JSON.stringify(response.data.user));

        

        alert("Login successful!");
        router.push("/register"); // ใส่เส้นทางที่คุณต้องการไปยังหน้า หลังจากล็อกอินสำเร็จ
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "An error occurred");
      } else {
        setErrorMessage("An error occurred");
      }
    }
  };

  return (
    <main>
      <FunFact />
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-bold text-center">Login</h3>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-3 p-2 border border-gray-300 rounded w-64"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 p-2 border border-gray-300 rounded w-64"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </form>
      </div>
    </main>
  );
}