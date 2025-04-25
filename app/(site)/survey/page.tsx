"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SurveyPage() {
  const searchParams = useSearchParams();
  const std_code = searchParams.get("std_code");
  const router = useRouter();

  const [formData, setFormData] = useState({
    std_code: "",
    name: "",
    birth_day: "",
    birth_month: "",
    birth_year: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
    phone: "",
    email: "",
    work_status: "",
    other_status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchStudent = async () => {
      if (!std_code) return;
      const res = await fetch(`/api/student?std_code=${std_code}`);
      const data = await res.json();

      if (data.success) {
        const student = data.data;
        const birthdate = new Date(student.birthdate);
        setFormData((prev) => ({
          ...prev,
          std_code: student.std_code || "",
          name: student.name_th || "",
          birth_day: birthdate.getDate().toString(),
          birth_month: (birthdate.getMonth() + 1).toString(),
          birth_year: birthdate.getFullYear().toString(),
          phone: student.phone || "",
          email: student.email || "",
        }));
      }
    };

    fetchStudent();
  }, [std_code]);

  const validateForm = () => {
    const requiredFields = [
      "std_code", "name", "birth_day", "birth_month", "birth_year", "address",
      "subdistrict", "district", "province", "zipcode", "phone", "email", "work_status"
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire("กรอกข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "warning");
      return;
    }

    const res = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "ส่งแบบสอบถามสำเร็จ",
        text: "ระบบได้อัปเดตสถานะเรียบร้อย",
        confirmButtonText: "ตกลง",
      }).then(() => {
        router.push(`/detail?std_code=${formData.std_code}`);
      });
    } else {
      Swal.fire("เกิดข้อผิดพลาด", data.message || "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-b from-green-900 to-red-900 text-white">
      <div className="max-w-4xl mx-auto bg-white text-black p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-4">แบบสอบถามการมีงานทำ</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div><strong>รหัสนักศึกษา:</strong> {formData.std_code}</div>

          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="ชื่อ - สกุล" className="w-full p-2 border rounded" />

          <div className="grid grid-cols-3 gap-4">
            <input name="birth_day" value={formData.birth_day} onChange={handleChange} placeholder="วัน" className="p-2 border rounded" />
            <input name="birth_month" value={formData.birth_month} onChange={handleChange} placeholder="เดือน" className="p-2 border rounded" />
            <input name="birth_year" value={formData.birth_year} onChange={handleChange} placeholder="ปี ค.ศ." className="p-2 border rounded" />
          </div>

          <input name="address" value={formData.address} onChange={handleChange} placeholder="ที่อยู่" className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input name="subdistrict" value={formData.subdistrict} onChange={handleChange} placeholder="ตำบล" className="p-2 border rounded" />
            <input name="district" value={formData.district} onChange={handleChange} placeholder="อำเภอ" className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="province" value={formData.province} onChange={handleChange} placeholder="จังหวัด" className="p-2 border rounded" />
            <input name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="รหัสไปรษณีย์" className="p-2 border rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="โทรศัพท์" className="p-2 border rounded" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
          </div>

          <div>
            <label className="font-medium">สถานภาพการทำงาน</label>
            <div className="flex flex-col gap-2 mt-2">
              {["ทำงานแล้ว", "ยังไม่ได้ทำงาน", "ศึกษาต่อ", "อื่น ๆ"].map((status) => (
                <label key={status}>
                  <input
                    type="radio"
                    name="work_status"
                    value={status}
                    checked={formData.work_status === status}
                    onChange={handleChange}
                  />{" "}
                  {status}
                </label>
              ))}
              {formData.work_status === "อื่น ๆ" && (
                <input
                  type="text"
                  name="other_status"
                  value={formData.other_status}
                  onChange={handleChange}
                  placeholder="โปรดระบุ"
                  className="border p-1 rounded"
                />
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded">
              ส่งข้อมูล
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
