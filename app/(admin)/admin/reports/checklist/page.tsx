'use client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type ChecklistRow = {
  timestamp: string
  std_code: string
  faculty: string
  program: string
  check_by: string
}

export default function ChecklistPage() {
  const [data, setData] = useState<ChecklistRow[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    date: '',
    faculty: '',
    program: '',
    sort: 'std_code'
  })

  const pageSize = 20

  const fetchData = async () => {
    const params = new URLSearchParams({
      ...filters,
      page: page.toString(),
      pageSize: pageSize.toString()
    })

    const res = await fetch(`/api/report/checklist?${params}`)
    const json = await res.json()
    setData(json.data)
    setTotalPages(Math.ceil(json.total / pageSize))
  }

  useEffect(() => {
    fetchData()
  }, [page, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const exportToExcel = () => {
    const exportData = data.map((row, idx) => ({
      'ลำดับ': (page - 1) * pageSize + idx + 1,
      'วันเวลา': row.timestamp?.slice(0, 16),
      'รหัสนักศึกษา': row.std_code,
      'คณะ': row.faculty,
      'สาขา': row.program,
      'เช็คโดย': row.check_by
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'รายงานเช็คชื่อ')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, 'รายงานเช็คชื่อ.xlsx')
  }

  const facultyOptions = Array.from(new Set(data.map(d => d.faculty))).sort()
  const programOptions = Array.from(new Set(data.map(d => d.program))).sort()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">รายงานข้อมูลการเช็คชื่อ</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-4 flex-wrap print:hidden">
        <input type="date" name="date" onChange={handleFilterChange} className="border px-2 py-1" />
        <select name="faculty" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">คณะ</option>
          {facultyOptions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select name="program" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">สาขา</option>
          {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
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
            <th className="border px-2 py-1">วันเวลา</th>
            <th className="border px-2 py-1">รหัสนักศึกษา</th>
            <th className="border px-2 py-1">คณะ</th>
            <th className="border px-2 py-1">สาขา</th>
            <th className="border px-2 py-1">เช็คโดย</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={`${row.std_code}-${row.timestamp}`}>
              <td className="border px-2 py-1 text-center">{(page - 1) * pageSize + idx + 1}</td>
              <td className="border px-2 py-1">{row.timestamp?.slice(0, 16)}</td>
              <td className="border px-2 py-1">{row.std_code}</td>
              <td className="border px-2 py-1">{row.faculty}</td>
              <td className="border px-2 py-1">{row.program}</td>
              <td className="border px-2 py-1">{row.check_by}</td>
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
