'use client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


type RegisterRow = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  academic_year: string
  cost_option: string
  price: number
  created_at: string
}

export default function RegisterReportPage() {
  const [data, setData] = useState<RegisterRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ faculty: '', program: '', sort: 'std_code' })

  const pageSize = 20

  const fetchData = async () => {
    const query = new URLSearchParams({
      ...filters,
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    const res = await fetch(`/api/report/register?${query}`)
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

  const getCostOptionLabel = (option: string | number) => {
    switch (option) {
      case 1:
      case '1':
        return 'ลงทะเบียนปกติ'
      case 2:
      case '2':
        return 'ลงทะเบียน+เช่าชุดครุย'
      case 3:
      case '3':
        return 'ลงทะเบียน+ตัดชุดครุย'
      default:
        return 'ไม่ระบุ'
    }
  }

  const exportToExcel = () => {
    const exportData = data.map((row, idx) => ({
      ลำดับ: (page - 1) * pageSize + idx + 1,
      รหัสนักศึกษา: row.std_code,
      ชื่อสกุล: row.name_th,
      คณะ: row.faculty,
      สาขา: row.program,
      ปีลงทะเบียน: row.academic_year,
      ตัวเลือก: getCostOptionLabel(row.cost_option),
      ราคา: row.price,
      วันที่ลงทะเบียน: row.created_at?.slice(0, 10),
    }))
  
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'รายงานลงทะเบียน')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'รายงานลงทะเบียน.xlsx')
  }
  

  // Generate dynamic options
  const facultyOptions = Array.from(new Set(data.map(d => d.faculty))).sort()
  const programOptions = Array.from(new Set(data.map(d => d.program))).sort()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">รายงานรายชื่อลงทะเบียน</h1>
      <div className="flex gap-4 mb-4 print:hidden">
  <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
    Export Excel
  </button>
  <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
    พิมพ์หน้านี้
  </button>
</div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select name="faculty" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">คณะ</option>
          {facultyOptions.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select name="program" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">สาขา</option>
          {programOptions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select name="sort" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="std_code">เรียงตามรหัสนักศึกษา</option>
          <option value="fullname">เรียงตามชื่อ (ไม่รวมคำนำหน้า)</option>
        </select>
      </div>

      {/* Table */}
      <table className="table-auto w-full border border-gray-300 print:text-xs">
        <thead className="bg-gray-100">
          <tr className='text-left'>
            <th className="border px-2 py-1">ลำดับ</th>
            <th className="border px-2 py-1">รหัส</th>
            <th className="border px-2 py-1">ชื่อ-สกุล</th>
            <th className="border px-2 py-1">คณะ</th>
            <th className="border px-2 py-1">สาขา</th>
            <th className="border px-2 py-1">ตัวเลือก</th>
            <th className="border px-2 py-1">ราคา</th>
            <th className="border px-2 py-1">วันที่ลงทะเบียน</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.std_code}>
              <td className="border px-2 py-1 text-center">{(page - 1) * pageSize + idx + 1}</td>
              <td className="border px-2 py-1">{row.std_code}</td>
              <td className="border px-2 py-1">{row.name_th}</td>
              <td className="border px-2 py-1">{row.faculty}</td>
              <td className="border px-2 py-1">{row.program}</td>
              <td className="border px-2 py-1">{getCostOptionLabel(row.cost_option)}</td>
              <td className="border px-2 py-1 text-right">{row.price.toLocaleString()}</td>
              <td className="border px-2 py-1">{row.created_at?.slice(0, 10)}</td>
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
