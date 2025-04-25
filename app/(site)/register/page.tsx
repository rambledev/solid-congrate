"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Banner from "@/components/Banner";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const std_code = searchParams.get("std_code");
  const router = useRouter();

  const [form, setForm] = useState({
    std_code: std_code || "",
    id_card: "",
    house_no: "",
    moo: "",
    village: "",
    road: "",
    soi: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
    phone: "",
    gender: "",
    academic_year: "",
    cost_option: "",
    price: "",
    consent: false,
  });

  useEffect(() => {
    const fetchRegist = async () => {
      if (!std_code) return;

      try {
        const res = await fetch(`/api/regist?std_code=${std_code}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          setForm({
            ...data.data,
            consent: data.data.consent_given ?? false, // ✅ ทำให้ checkbox ติ๊กถูกอัตโนมัติ
          });
          Swal.fire("แจ้งเตือน", "คุณได้ทำการลงทะเบียนแล้ว", "info");
        }
      } catch (error) {
        console.error("fetch error", error);
      }
    };
    fetchRegist();
  }, [std_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === "cost_option") {
      let price = "";
      if (value === "1") price = "2500";
      else if (value === "2") price = "3700";
      else if (value === "3") price = "4500";
      updatedForm.price = price;
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form submission", form);

    for (const key in form) {
      if (!form[key as keyof typeof form]) {
        Swal.fire("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "warning");
        return;
      }
    }

    try {
      const res = await fetch("/api/regist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire("สำเร็จ", data.message, "success");
        router.push(`/detail?std_code=${std_code}`);
      } else {
        Swal.fire("เกิดข้อผิดพลาด", data.message, "error");
      }
    } catch (err) {
      console.error("submit error", err);
      Swal.fire("ผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  return (
    <main className="min-h-screen px-6 py-10 bg-green-900 text-gray-800">
      <Banner />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <button
  onClick={() => router.push(`/detail?std_code=${form.std_code}`)}
  className="mb-4 text-blue-700 hover:underline"
>
  ← กลับหน้ารายละเอียด
</button>


        <h1 className="text-2xl font-bold text-center mb-6">แบบฟอร์มลงทะเบียน</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label>รหัสนักศึกษา</label><input name="std_code" value={form.std_code} readOnly className="w-full bg-gray-100 px-3 py-2 border rounded" /></div>
            <div><label>เลขบัตรประชาชน</label><input name="id_card" value={form.id_card} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>บ้านเลขที่</label><input name="house_no" value={form.house_no} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>หมู่</label><input name="moo" value={form.moo} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>หมู่บ้าน</label><input name="village" value={form.village} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>ถนน</label><input name="road" value={form.road} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>ซอย</label><input name="soi" value={form.soi} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>ตำบล/แขวง</label><input name="subdistrict" value={form.subdistrict} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>อำเภอ/เขต</label><input name="district" value={form.district} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div>
              <label>จังหวัด</label>
              <select name="province" value={form.province} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                <option value="">-- เลือกจังหวัด --</option>
                {[
                  "กรุงเทพมหานคร", "เชียงใหม่", "ขอนแก่น", "นครราชสีมา", "มหาสารคาม", "ชลบุรี", "ระยอง", "อุดรธานี", "สุรินทร์", "บุรีรัมย์"
                ].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div><label>รหัสไปรษณีย์</label><input name="zipcode" value={form.zipcode} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>เบอร์โทรศัพท์</label><input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div>
              <label>เพศ</label>
              <div className="flex gap-4">
                <label><input type="radio" name="gender" value="ชาย" checked={form.gender === "ชาย"} onChange={handleChange} /> ชาย</label>
                <label><input type="radio" name="gender" value="หญิง" checked={form.gender === "หญิง"} onChange={handleChange} /> หญิง</label>
              </div>
            </div>
            <div><label>ปีที่สำเร็จการศึกษา</label><input name="academic_year" value={form.academic_year} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
          
          </div>

          <div>
            <label className="block font-medium mb-1 mt-4">ค่าใช้จ่าย</label>
            <div className="space-y-2">
              <label className="block"><input type="radio" name="cost_option" value="1" checked={form.cost_option === "1"} onChange={handleChange} /> ลงทะเบียนเข้ารับปริญญาบัตร (2,500 บาท)</label>
              <label className="block"><input type="radio" name="cost_option" value="2" checked={form.cost_option === "2"} onChange={handleChange} /> ลงทะเบียนเข้ารับปริญญาบัตร + เช่าชุดครุยวิทยฐานะ (3,700 บาท — คืน 1,000)</label>
              <label className="block"><input type="radio" name="cost_option" value="3" checked={form.cost_option === "3"} onChange={handleChange} /> ลงทะเบียนเข้ารับปริญญาบัตร + ตัดชุดครุยวิทยฐานะ (4,500 บาท)</label>
            </div>
          </div>

          {form.price && <p className="text-center text-lg text-blue-600 font-semibold">ยอดชำระ: {parseInt(form.price).toLocaleString()} บาท</p>}

          <div className="flex items-start gap-2 mt-6">
  <input
    type="checkbox"
    id="consent"
    name="consent"
    required
    className="mt-1"
    checked={form.consent}
    onChange={(e) =>
      setForm({ ...form, consent: e.target.checked })
    }
  />
  <label htmlFor="consent" className="text-sm leading-tight">
    ข้าพเจ้ายินยอมให้มีการใช้ข้อมูลส่วนบุคคลและเปิดเผยบางส่วนตามที่ระบุใน
    <a href="/privacy-policy" className="text-blue-600 underline ml-1">นโยบายความเป็นส่วนตัว</a>
  </label>
</div>



          <div className="text-center mt-6">
            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded">บันทึกข้อมูล</button>
          </div>
        </form>
      </div>
    </main>
  );
}
