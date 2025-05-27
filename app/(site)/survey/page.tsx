"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type ThaiAddress = {
  district: string;       // ตำบล
  amphoe: string;         // อำเภอ
  province: string;       // จังหวัด
  zipcode: number;
  district_code: number;
  amphoe_code: number;
  province_code: number;
};


export default function SurveyPage() {

  const [addressList, setAddressList] = useState<ThaiAddress[]>([]);


useEffect(() => {
  const fetchAddressData = async () => {
    try {
      const res = await fetch("/address_api.json");
      const data = await res.json();
      setAddressList(data);
    } catch (error) {
      console.error("โหลดข้อมูล address_api.json ไม่สำเร็จ:", error);
    }
  };

  fetchAddressData();
}, []);

useEffect(() => {
  console.log("รายการตำบลที่โหลดได้:", addressList);
}, [addressList]);



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
    workplace: "",
    work_address: "",
    position: "",
    salary: "", // ไม่บังคับ
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
  
    // ถ้ากรอกหรือเลือกตำบล ให้ค้นหาและเติมอำเภอ จังหวัด รหัสไปรษณีย์
    if (name === "subdistrict") {
      const match = addressList.find(
        (item) => item.district.trim().toLowerCase() === value.trim().toLowerCase()
      );
  
      if (match) {
        updatedForm.district = match.amphoe;
        updatedForm.province = match.province;
        updatedForm.zipcode = match.zipcode.toString();
      } else {
        updatedForm.district = "";
        updatedForm.province = "";
        updatedForm.zipcode = "";
      }
    }
  
    setFormData(updatedForm);
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

  <div>
    <label htmlFor="name" className="block font-medium mb-1">ชื่อ - สกุล <span className="text-red-500">*</span></label>
    <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="ชื่อ - สกุล" className="w-full p-2 border rounded" />
  </div>

  <div>
  <div>
  <label className="block font-medium mb-2">วันเกิด</label>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label htmlFor="birth_day" className="block text-sm mb-1">วัน <span className="text-red-500">*</span></label>
      <input id="birth_day" name="birth_day" value={formData.birth_day} onChange={handleChange} placeholder="วัน" className="w-full p-2 border rounded" />
    </div>
    <div>
      <label htmlFor="birth_month" className="block text-sm mb-1">เดือน <span className="text-red-500">*</span></label>
      <input id="birth_month" name="birth_month" value={formData.birth_month} onChange={handleChange} placeholder="เดือน" className="w-full p-2 border rounded" />
    </div>
    <div>
      <label htmlFor="birth_year" className="block text-sm mb-1">ปี (ค.ศ.) <span className="text-red-500">*</span></label>
      <input id="birth_year" name="birth_year" value={formData.birth_year} onChange={handleChange} placeholder="ปี ค.ศ." className="w-full p-2 border rounded" />
    </div>
  </div>
</div>

  </div>

  <div>
    <label htmlFor="address" className="block font-medium mb-1">ที่อยู่ปัจจุบัน<span className="text-red-500">*</span></label>
    <input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="ที่อยู่" className="w-full p-2 border rounded" />
  </div>

  <div>
  <label className="block font-medium mb-1">
    ตำบล / อำเภอ<span className="text-red-500">*</span>
  </label>
  <div className="grid grid-cols-2 gap-4">
    {/* ตำบล */}
    <input
      list="subdistricts"
      id="subdistrict"
      name="subdistrict"
      value={formData.subdistrict}
      onChange={handleChange}
      placeholder="ตำบล"
      className="p-2 border rounded"
    />
    {/* อำเภอ */}
    <input
      id="district"
      name="district"
      value={formData.district}
      onChange={handleChange}
      placeholder="อำเภอ"
      className="p-2 border rounded"
    />
  </div>

  {/* Datalist ที่แสดงรายการตำบล */}
  <datalist id="subdistricts">
  {Array.from(
    new Map(
      addressList.map(item => [item.district, item])
    ).values()
  ).map((item, idx) => (
    <option key={idx} value={item.district}>
      {item.district} ({item.amphoe})
    </option>
  ))}
</datalist>
</div>


  <div>
    <label className="block font-medium mb-1">จังหวัด / รหัสไปรษณีย์<span className="text-red-500">*</span></label>
    <div className="grid grid-cols-2 gap-4">
      <input id="province" name="province" value={formData.province} onChange={handleChange} placeholder="จังหวัด" className="p-2 border rounded" />
      <input id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="รหัสไปรษณีย์" className="p-2 border rounded" />
    </div>
  </div>

  <div>
    <label className="block font-medium mb-1">โทรศัพท์ / Email<span className="text-red-500">*</span></label>
    <div className="grid grid-cols-2 gap-4">
      <input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="โทรศัพท์" className="p-2 border rounded" />
      <input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
    </div>
  </div>

  <div>
    <label className="font-medium block mb-2">สถานภาพการทำงาน<span className="text-red-500">*</span></label>
    <div className="flex flex-col gap-2">
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
  {formData.work_status === "ทำงานแล้ว" && (
  <div className="space-y-4">
    <div>
      <label htmlFor="workplace" className="block font-medium mb-1">สถานที่ทำงาน <span className="text-red-500">*</span></label>
      <input id="workplace" name="workplace" value={formData.workplace} onChange={handleChange} placeholder="ชื่อสถานที่ทำงาน" className="w-full p-2 border rounded" />
    </div>

    <label htmlFor="work_address" className="block font-medium mb-1">จังหวัดที่ทำงาน <span className="text-red-500">*</span></label>
<input
  list="provinceList"
  id="work_address"
  name="work_address"
  value={formData.work_address}
  onChange={handleChange}
  placeholder="จังหวัดที่ทำงาน"
  className="w-full p-2 border rounded"
/>

<datalist id="provinceList">
  {Array.from(new Set(addressList.map((item) => item.province))).map((province, idx) => (
    <option key={idx} value={province} />
  ))}
</datalist>


    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="position" className="block font-medium mb-1">ตำแหน่ง <span className="text-red-500">*</span></label>
        <input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="ตำแหน่งงาน" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="salary" className="block font-medium mb-1">เงินเดือน (บาท)</label>
        <input id="salary" name="salary" value={formData.salary} onChange={handleChange} placeholder="ไม่บังคับกรอก" className="w-full p-2 border rounded" />
      </div>
    </div>
  </div>
)}


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
