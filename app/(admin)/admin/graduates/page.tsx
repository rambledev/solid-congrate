'use client'

import { useEffect, useState } from 'react'

type Graduate = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  work_status: string
  regist_status: string
  fac_type: string
  img: string
  email: string
  fix_comment: string
}

const presetMessages = [
  'รูปประจำตัวไม่ถูกต้องให้อัปโหลดรูปใหม่',
  'ข้อมูลการลงทะเบียนไม่ถูกต้องให้ลงทะเบียนใหม่',
  'การกรอกแบบสอบถามการมีงานทำไม่ถูกต้อง',
  'มีปัญหาในการชำระเงิน โปรดติดต่อ admin',
  'ดำเนินการครบถ้วน',
]

const getBgColor = (fixComment: string) => {
  if (fixComment === 'ชำระเงินแล้ว') {
    return 'bg-green-300'
  } else if (!fixComment || fixComment === 'ดำเนินการครบถ้วน') {
    return 'bg-blue-300'
  } else {
    return 'bg-yellow-300'
  }
}


export default function GraduatesPage() {
  const [data, setData] = useState<Graduate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterField, setFilterField] = useState('name_th')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [notifyMessages, setNotifyMessages] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/graduates')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      }
    }
    fetchData()
  }, [])

  const handleNotifyStudent = async (stdCode: string, comment: string, email: string) => {
    if (!comment) {
      alert('กรุณากรอกข้อความที่ต้องการแจ้งเตือน')
      return
    }

    if (!confirm(`ยืนยันที่จะแจ้งรหัส ${stdCode} ด้วยข้อความ:\n"${comment}" ?`)) return

    try {
      const res = await fetch('/api/notify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ std_code: stdCode, comment, student_email: email }),
      })

      const json = await res.json()
      if (json.success) {
        alert(`ส่งข้อความไปยังรหัส ${stdCode} แล้ว`)
        setNotifyMessages(prev => ({ ...prev, [stdCode]: '' })) // clear ช่องข้อความ
      } else {
        alert(`เกิดข้อผิดพลาด: ${json.message}`)
      }
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
    }
  }

  const filteredData = data.filter((grad) =>
    grad[filterField as keyof Graduate]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastRow = rowsPerPage === -1 ? filteredData.length : currentPage * rowsPerPage
  const indexOfFirstRow = rowsPerPage === -1 ? 0 : indexOfLastRow - rowsPerPage
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  const totalPage = rowsPerPage === -1 ? 1 : Math.ceil(filteredData.length / rowsPerPage)

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">รายชื่อบัณฑิต</h1>

      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <div className="flex flex-wrap space-x-2 items-center">
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700"
          >
            <option value="std_code">รหัสนักศึกษา</option>
            <option value="name_th">ชื่อ-นามสกุล</option>
            <option value="faculty">คณะ</option>
            <option value="program">สาขา</option>
            <option value="fac_type">วุฒิบัณฑิต</option>
            <option value="work_status">สถานะแบบสอบถาม</option>
            <option value="regist_status">สถานะลงทะเบียน</option>
          </select>

          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="border rounded px-3 py-2 text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" id="graduates-table">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="text-left text-gray-500 uppercase text-sm border-b">
              <th className="py-3 px-6 border">รหัสนักศึกษา</th>
              <th className="py-3 px-6 border">ชื่อ-นามสกุล</th>
              <th className="py-3 px-6 border">คณะ</th>
              <th className="py-3 px-6 border">สาขา</th>
              <th className="py-3 px-6 border">วุฒิบัณฑิต</th>
              <th className="py-3 px-6 border">สถานะแบบสอบถาม</th>
              <th className="py-3 px-6 border">สถานะลงทะเบียน</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((grad, index) => (
              <tr key={index} className="border hover:bg-gray-50">
                <td className="py-4 px-6 border">
  <div className={`p-1 rounded ${getBgColor(grad.fix_comment)}`}>
    {grad.std_code}
  </div>
  <img
    src={grad.img && grad.img.trim() !== "" ? "/uploads/" + grad.img.trim() : "/blank.png"}
    alt="student"
    className="w-[150px] h-[200px] object-cover rounded shadow-md mt-2"
    crossOrigin="anonymous"
  />

  <select
    className="mt-2 w-full px-2 py-1 border rounded text-sm"
    onChange={(e) =>
      setNotifyMessages(prev => ({ ...prev, [grad.std_code]: e.target.value }))
    }
  >
    <option value="">-- เลือกข้อความสำเร็จรูป --</option>
    {presetMessages.map((msg, i) => (
      <option key={i} value={msg}>{msg}</option>
    ))}
  </select>

  <input
    type="text"
    placeholder="ข้อความแจ้งเตือน"
    value={notifyMessages[grad.std_code] || ''}
    onChange={(e) =>
      setNotifyMessages(prev => ({ ...prev, [grad.std_code]: e.target.value }))
    }
    className="mt-2 w-full px-2 py-1 border rounded text-sm"
  />

  <button
    onClick={() =>
      handleNotifyStudent(grad.std_code, notifyMessages[grad.std_code] || '', grad.email)
    }
    className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
  >
    แจ้งเตือนไปยังบัณฑิต
  </button>
</td>


                <td className="py-4 px-6 border">{grad.name_th}</td>
                <td className="py-4 px-6 border">{grad.faculty}</td>
                <td className="py-4 px-6 border">{grad.program}</td>
                <td className="py-4 px-6 border">{grad.fac_type}</td>
                <td className="py-4 px-6 border">{grad.work_status}</td>
                <td className="py-4 px-6 border">{grad.regist_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {rowsPerPage !== -1 && totalPage > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ←
          </button>

          {[...Array(totalPage)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={currentPage === totalPage}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
