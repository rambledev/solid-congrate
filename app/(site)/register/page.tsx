"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Banner from "@/components/Banner";

type ThaiAddress = {
  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
  district_code: number;
  amphoe_code: number;
  province_code: number;
};

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const std_code = searchParams.get("std_code");
  const router = useRouter();

  const initialAddress = {
    house_no: "",
    moo: "",
    village: "",
    road: "",
    soi: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
  };

  const [addressList, setAddressList] = useState<ThaiAddress[]>([]);

  const [form, setForm] = useState({
    std_code: std_code || "",
    full_name: "",
    id_card: "",
    email: "",
    phone: "",
    gender: "",
    academic_year: "",
    cost_option: "",
    price: "",
    weight: "",
    height: "",
    consent: false,
    address_type: "new",
    ...initialAddress,
  });

  useEffect(() => {
    fetchStudent();
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

  const fetchRegist = async () => {
    if (!std_code) return;
    try {
      const res = await fetch(`/api/regist?std_code=${std_code}`);
      if (!res.ok) return;
      const data = await res.json();
      console.log("ข้อมูลจาก API:", data.data);

      if (data.success) {
        const name = data.data.name_th || "";
        let gender = "";
        if (name.startsWith("นาย")) gender = "ชาย";
        else if (name.startsWith("นาง") || name.startsWith("นางสาว")) gender = "หญิง";


        console.log("fetch regist data = "+data.data);

        setForm((prev) => ({
          ...prev,
          ...data.data,
          std_code,
          full_name: name,
          gender,
          weight: data.data.weight || "",  
          height: data.data.height || "",  
          consent: data.data.consent_given ?? false,
          address_type: prev.address_type || "new",
        }));
        Swal.fire("แจ้งเตือน", "คุณได้ทำการลงทะเบียนแล้ว", "info");
      }
    } catch (error) {
      console.error("fetch error", error);
    }
  };

  const fetchStudent = async () => {
    if (!std_code) return;
    try {
      const res = await fetch(`/api/student?std_code=${std_code}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        const student = data.data;
        const name = student.name_th || "";
  
        let gender = "";
        if (name.startsWith("นาย")) gender = "ชาย";
        else if (name.startsWith("นาง") || name.startsWith("นางสาว")) gender = "หญิง";
  
        setForm((prev) => ({
          ...prev,
          std_code: student.std_code || prev.std_code,
          full_name: name,
          id_card: student.citizen || "",
          phone: student.phone || "",
          email: student.email || "",
          gender,
        }));
      }
    } catch (err) {
      console.error("fetch student error", err);
    }
  };
  

  const fetchAddress = async () => {
    try {
      const res = await fetch(`/api/address?std_code=${std_code}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          ...data.address,
        }));
      }
    } catch (err) {
      console.error("fetch address error", err);
    }
  };

  useEffect(() => {
    fetchRegist();
  }, [std_code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

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

    if (name === "address_type") {
      updatedForm.address_type = value;
      if (value === "registered") fetchAddress();
      else if (value === "new") Object.assign(updatedForm, initialAddress);
    }

    if (name === "cost_option") {
      let price = "";
      let shouldClear = false;
      if (value === "1") {
        price = "2500";
        shouldClear = true;
      } else if (value === "2") price = "3700";
      else if (value === "3") price = "4500";
      else price = "1000";

      updatedForm.cost_option = value;
      updatedForm.price = price;
      if (!shouldClear) {
        updatedForm.weight = form.weight;
      }
      updatedForm.height = shouldClear ? "" : form.height;
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "std_code", "full_name", "id_card", "email", "phone", "gender",
      "academic_year", "cost_option", "house_no", "moo", "village",
      "road", "soi", "subdistrict", "district", "province", "zipcode" , "height" , "weight"
    ];

    for (const key of requiredFields) {
      if (!form[key as keyof typeof form]) {
        Swal.fire("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น", "warning");
        return;
      }
    }

    if (["2", "3"].includes(form.cost_option)) {
      if (!form.weight || !form.height) {
        Swal.fire("แจ้งเตือน", "กรุณากรอกน้ำหนักและส่วนสูงให้ครบถ้วน", "warning");
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

  const requiredMark = <span className="text-red-500">*</span>;

  return (
    <main className="min-h-screen px-6 py-10 bg-green-900 text-gray-800">
      <Banner />
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <button
          onClick={() => router.push(`/detail?std_code=${form.std_code}`)}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded"
        >← กลับหน้ารายละเอียด</button>

        <h1 className="text-2xl font-bold text-center mb-4">แบบฟอร์มลงทะเบียน</h1>
        <span className="text-red-500 text-center block mb-4">* ที่อยู่ฟอร์มลงทะเบียนนี้ใช้สำหรับจัดส่งใบปริญญา</span>

        {/* <div className="mt-4">
          <p className="font-medium">กรุณาเลือกประเภทของที่อยู่:</p>
          <div className="mt-2 space-y-2 ml-4">
            {['registered', 'current', 'new'].map((val) => (
              <label key={val} className="block">
                <input
                  type="radio"
                  name="address_type"
                  value={val}
                  checked={form.address_type === val}
                  onChange={handleChange}
                  className="mr-2"
                />
                {val === 'registered' ? 'ใช้ข้อมูลที่อยู่ตามทะเบียน' : val === 'current' ? 'ใช้ข้อมูลที่อยู่ปัจจุบัน' : 'ใช้ที่อยู่ใหม่'}
              </label>
            ))}
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <h2 className="text-lg font-semibold">ข้อมูลส่วนตัว</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label>รหัสนักศึกษา {requiredMark}</label><input name="std_code" value={form.std_code} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
            <div><label>ชื่อ-สกุล {requiredMark}</label><input name="full_name" value={form.full_name} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
            <div><label>เลขบัตรประชาชน {requiredMark}</label><input name="id_card" value={form.id_card} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
            <div><label>เบอร์โทรศัพท์ {requiredMark}</label><input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>Email สำหรับรับการแจ้งเตือน {requiredMark}</label><input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>เพศ {requiredMark}</label><input name="gender" value={form.gender} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
            <div><label>ปีที่สำเร็จการศึกษา {requiredMark}</label><input name="academic_year" value={form.academic_year} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
          </div>

          <hr className="my-6" />
          <h2 className="text-lg font-semibold">ข้อมูลที่อยู่</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label>บ้านเลขที่ {requiredMark}</label><input name="house_no" value={form.house_no} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>หมู่ {requiredMark}</label><input name="moo" value={form.moo} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>หมู่บ้าน {requiredMark}</label><input name="village" value={form.village} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>ถนน {requiredMark}</label><input name="road" value={form.road} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>ซอย {requiredMark}</label><input name="soi" value={form.soi} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div>
              <label>ตำบล/แขวง {requiredMark}</label>
              <input
                list="subdistricts"
                name="subdistrict"
                value={form.subdistrict}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="เลือกตำบล"
              />
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
            <div><label>อำเภอ/เขต {requiredMark}</label><input name="district" value={form.district} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>จังหวัด {requiredMark}</label><input name="province" value={form.province} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
            <div><label>รหัสไปรษณีย์ {requiredMark}</label><input name="zipcode" value={form.zipcode} onChange={handleChange} className="w-full px-3 py-2 border rounded" /></div>
          </div>

          {/* ค่าใช้จ่าย และ น้ำหนัก/ส่วนสูง ตามเดิม... */}

          {/* ค่าใช้จ่าย */}
          <div>
            <label className="block font-medium mb-2">ค่าใช้จ่าย {requiredMark}</label>
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="grid grid-cols-2 bg-gray-100 font-semibold text-gray-800">
                <div className="px-4 py-2">ตัวเลือก</div>
                <div className="px-4 py-2 border-l border-gray-300 text-right">ราคา</div>
              </div>
              {[
                { val: "1", text: "ลงทะเบียนเข้ารับปริญญาบัตร", price: "2,500 บาท" },
                { val: "2", text: "ลงทะเบียน + เช่าชุดครุยวิทยฐานะ", price: "3,700 บาท", note: "คืน 1,000" },
                { val: "3", text: "ลงทะเบียน + ตัดชุดครุยวิทยฐานะ", price: "4,500 บาท" },
                { val: "4", text: "ไม่เข้ารับและให้ส่งใบปริญญาบัตรตามที่อยู่หน้านี้", price: "xxxx บาท" },
              ].map(({ val, text, price, note }) => (
                <label key={val} className="grid grid-cols-2 items-center border-t border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center gap-2 px-4 py-2">
                    <input
                      type="radio"
                      name="cost_option"
                      value={val}
                      checked={form.cost_option === val}
                      onChange={handleChange}
                    />
                    {text}
                  </div>
                  <div className="px-4 py-2 border-l border-gray-200 text-right">
                    {price} {note && <span className="text-sm text-gray-500">({note})</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* น้ำหนัก/ส่วนสูง */}
          {["2", "3"].includes(form.cost_option) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>น้ำหนัก (กิโลกรัม) {requiredMark}</label>
                <input name="weight" value={form.weight} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label>ส่วนสูง (เซนติเมตร) {requiredMark}</label>
                <input name="height" value={form.height} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
          )}

          {/* ยอดชำระ */}
          {form.price && (
            <p className="text-center text-lg text-blue-600 font-semibold">
              ยอดชำระ: {parseInt(form.price).toLocaleString()} บาท
            </p>
          )}

          {/* Consent & Submit */}
          <div className="flex items-start gap-2 mt-6">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              required
              className="mt-1"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            />
            <label htmlFor="consent" className="text-sm leading-tight">
              ข้าพเจ้ายินยอมให้มีการใช้ข้อมูลส่วนบุคคลและเปิดเผยบางส่วนตามที่ระบุใน
              <a href="/privacy-policy" className="text-blue-600 underline ml-1">นโยบายความเป็นส่วนตัว</a>
            </label>
          </div>

          <div className="text-center mt-6">
            <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded">
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
