"use client"; // ใช้ ⚠️ client-side
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Signin from "@/components/Auth/Signin";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', credentials);
            if (response.data.success) {
                router.push("/register");
            } else {
                alert("ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการล็อกอิน");
        }
    };

    return (
        <div>
            <Signin onChange={handleChange} onSubmit={handleSubmit} credentials={credentials} />
        </div>
    );
};

export default Login;