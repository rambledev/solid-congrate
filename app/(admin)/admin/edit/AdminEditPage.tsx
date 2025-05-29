'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Graduate = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  fac_type: string
  birthdate: string
  email: string | null
  citizen: string
  img: string
}

export default function EditStudentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const std_code = searchParams.get('std_code')

  const [data, setData] = useState<Graduate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!std_code) return

    async function fetchStudent() {
      setLoading(true)
      try {
        const res = await fetch(`/api/student?std_code=${std_code}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          alert('ไม่พบนักศึกษา')
          router.push('/admin/graduates')
        }
      } catch (err) {
        console.error(err)
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [std_code, router])

  const handleSave = async () => {
    if (!data) return

    if (!confirm('ยืนยันการบันทึกข้อมูล')) return

    try {
      setSaving(true)
      const res = await fetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (json.success) {
        alert('บันทึกข้อมูลสำเร็จแล้ว')
        router.push('/admin/graduates')
      } else {
        alert('ไม่สามารถบันทึกข้อมูลได้: ' + json.message)
      }
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-gray-600">กำลังโหลดข้อมูล...</div>

  if (!data) return <div className="p-6 text-red-500">ไม่พบข้อมูล</div>

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">แก้ไขข้อมูลนักศึกษา</h1>

      <div className="space-y-4">
        <div>
          <label className="font-medium text-gray-700">รหัสนักศึกษา</label>
          <input type="text" value={data.std_code} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>

        <div>
          <label className="font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input type="text" value={data.name_th} disabled onChange={(e) => setData({ ...data, name_th: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="font-medium text-gray-700">คณะ</label>
          <input type="text" value={data.faculty} disabled onChange={(e) => setData({ ...data, faculty: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="font-medium text-gray-700">สาขา</label>
          <input type="text" value={data.program} disabled onChange={(e) => setData({ ...data, program: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="font-medium text-gray-700">วุฒิบัณฑิต</label>
          <input type="text" value={data.fac_type} disabled onChange={(e) => setData({ ...data, fac_type: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="font-medium text-gray-700">อีเมล</label>
          <input type="email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="font-medium text-gray-700">วันเกิด</label>
          <input
            type="date"
            value={data.birthdate?.substring(0, 10) || ''}
            onChange={(e) => setData({ ...data, birthdate: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">เลขบัตรประชาชน</label>
          <input type="text" value={data.citizen} disabled onChange={(e) => setData({ ...data, citizen: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
  <label className="font-medium text-gray-700 mb-1 block">รูปนักศึกษา</label>
  {data.img ? (
    <img
      src={`/uploads/${data.img}`}
      alt="student"
      onError={(e) => (e.currentTarget.src = "/blank.png")}
      className="w-[150px] h-[200px] object-cover border rounded shadow mb-2"
    />
  ) : (
    <div className="text-sm text-gray-500 mb-2">ไม่มีรูปภาพ</div>
  )}

  <button
    onClick={() => router.push(`/admin/adminphoto?std_code=${data.std_code}`)}
    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded"
  >
    แก้ไขรูปภาพ
  </button>
</div>

      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
      </button>
    </div>
  )
}
