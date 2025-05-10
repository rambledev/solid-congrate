'use client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type SurveyRow = {
  std_code: string
  name: string
  province: string
  phone: string
  email: string
  work_status: string
  other_status: string
  created_at: string
  workplace: string
  work_address: string
}

export default function EmploymentReport() {
  const [data, setData] = useState<SurveyRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ province: '', work_status: '', sort: 'std_code' })
  const pageSize = 20

  const fetchData = async () => {
    const query = new URLSearchParams({
      ...filters,
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    const res = await fetch(`/api/report/employment?${query}`)
    const json = await res.json()
    setData(json.data)
    setTotalPages(Math.ceil(json.total / pageSize))
  }

  useEffect(() => {
    fetchData()
  }, [page, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const exportToExcel = () => {
    const exportData = data.map((row, idx) => ({
        'ลำดับ': (page - 1) * pageSize + idx + 1,
        'รหัส': row.std_code,
        'ชื่อ': row.name,
        'จังหวัด': row.province,
        'เบอร์โทร': row.phone,
        'Email': row.email,
        'สถานะงาน': row.work_status,
        'สถานที่ทำงาน': row.workplace,
        'จังหวัดที่ทำงาน': row.work_address,
        'อื่น ๆ': row.other_status, // ✅ แบบนี้ถูกต้อง
        'ลงทะเบียนเมื่อ': row.created_at?.slice(0, 16),
      }))
      

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลการมีงานทำ')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, 'รายงานการมีงานทำ.xlsx')
  }

  const provinceOptions = Array.from(new Set(data.map(d => d.province))).sort()
  const workStatusOptions = Array.from(new Set(data.map(d => d.work_status))).sort()

  function formatDateTime(value: string): string {
    const date = new Date(value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }
  

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">รายงานข้อมูลการมีงานทำ</h1>

      {/* Filter & Buttons */}
      <div className="flex gap-4 mb-4 flex-wrap print:hidden">
        <select name="province" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">จังหวัด</option>
          {provinceOptions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select name="work_status" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">สถานะ</option>
          {workStatusOptions.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <select name="sort" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="std_code">เรียงตามรหัส</option>
          <option value="name">เรียงตามชื่อ</option>
        </select>
        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
          Export Excel
        </button>
        <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          พิมพ์หน้านี้
        </button>
      </div>

      {/* Table */}
      <table className="table-auto w-full border border-gray-300 print:text-xs">
        <thead className="bg-gray-100">
          <tr className='text-left'>
            <th className="border px-2 py-1">ลำดับ</th>
            <th className="border px-2 py-1">รหัส</th>
            <th className="border px-2 py-1">ชื่อ</th>
            <th className="border px-2 py-1">จังหวัด</th>
            <th className="border px-2 py-1">เบอร์โทร</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">สถานะงาน</th>
            <th className="border px-2 py-1">จังหวัดที่ทำงานงาน</th>
            <th className="border px-2 py-1">อื่น ๆ</th>
            <th className="border px-2 py-1">ลงทะเบียนเมื่อ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.std_code}>
              <td className="border px-2 py-1 text-center">{(page - 1) * pageSize + idx + 1}</td>
              <td className="border px-2 py-1">{row.std_code}</td>
              <td className="border px-2 py-1">{row.name}</td>
              <td className="border px-2 py-1">{row.province}</td>
              <td className="border px-2 py-1">{row.phone}</td>
              <td className="border px-2 py-1">{row.email}</td>
              <td className="border px-2 py-1">{row.work_status}</td>
              <td className="border px-2 py-1">{row.workplace}<br/>{row.work_address}</td>
              <td className="border px-2 py-1">{row.other_status}</td>
              <td className="border px-2 py-1">
  {row.created_at ? formatDateTime(row.created_at) : ""}
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>ก่อนหน้า</button>
        <span>หน้า {page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>ถัดไป</button>
      </div>
    </div>
  )
}
