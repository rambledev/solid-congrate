"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const std_code = searchParams.get("std_code")

  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchStudent = async () => {
    if (!std_code) return
    setLoading(true)
    try {
      const res = await fetch(`/api/student?std_code=${std_code}`)
      const json = await res.json()
      if (json.success) {
        setStudent(json.data)
      } else {
        Swal.fire("ไม่พบข้อมูล", json.message || "เกิดข้อผิดพลาด", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("เกิดข้อผิดพลาดในการโหลดข้อมูล", "", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudent()
  }, [std_code])

  const handleChange = (field: string, value: string) => {
    setStudent((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!student?.std_code) return
    setSaving(true)
    try {
      const res = await fetch("/api/student/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      })
      const json = await res.json()
      if (json.success) {
        Swal.fire("บันทึกข้อมูลสำเร็จ", "", "success")
      } else {
        Swal.fire("ไม่สามารถบันทึกข้อมูลได้", json.message || "", "error")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("เกิดข้อผิดพลาดในการบันทึก", "", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center text-gray-500 py-10">⏳ กำลังโหลดข้อมูล...</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-xl font-bold text-green-800 mb-6">แก้ไขข้อมูลส่วนตัว</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">รหัสนักศึกษา</label>
          <input
            type="text"
            value={student?.std_code || ""}
            readOnly
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">ชื่อ - สกุล กรณีเปลี่ยนชื่อต้องแนบหลักฐาน</label>
          <input
            type="text"
            value={student?.name_th || ""}

            onChange={(e) => handleChange("name_th", e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email ใช้สำหรับติดต่อและรับการแจ้งเตือน</label>
          <input
            type="email"
            value={student?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">ความประสงค์การแต่งกาย</label>
          <input
            type="text"
            value={student?.citizen || ""}
            onChange={(e) => handleChange("citizen", e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
      >
        {saving ? "กำลังบันทึก..." : "💾 บันทึกข้อมูล"}
      </button>
    </div>
  )
}