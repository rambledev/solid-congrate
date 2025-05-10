'use client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type Graduate = {
  std_code: string
  name_th: string
  faculty: string
  program: string
  note: string
  img: string
}

export default function GraduatesPage() {
  const [data, setData] = useState<Graduate[]>([])
  const [filters, setFilters] = useState({ faculty: '', program: '', note: '', sort: 'std_code' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  const fetchData = async () => {
    const query = new URLSearchParams({
      ...filters,
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    const res = await fetch(`/api/report/graduates?${query}`)
    const json = await res.json()
    setData(json.data)
    setTotalPages(Math.ceil(json.total / pageSize))
  }

  useEffect(() => {
    fetchData()
  }, [filters, page])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const exportToExcel = () => {
    const exportData = data.map((row, idx) => ({
      'ลำดับ': (page - 1) * pageSize + idx + 1,
      'รหัส': row.std_code,
      'ชื่อ': row.name_th,
      'คณะ': row.faculty,
      'สาขา': row.program,
      'เกียรตินิยม': row.note,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'รายชื่อบัณฑิต')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, 'รายชื่อบัณฑิต.xlsx')
  }

  const facultyOptions = Array.from(new Set(data.map(d => d.faculty))).sort()
  const programOptions = Array.from(new Set(data.map(d => d.program))).sort()
  const noteOptions = Array.from(new Set(data.map(d => d.note))).sort()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">รายงานรายชื่อบัณฑิต</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap print:hidden">
        <select name="faculty" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">คณะ</option>
          {facultyOptions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select name="program" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">สาขา</option>
          {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select name="note" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="">เกียรตินิยม</option>
          {noteOptions.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select name="sort" onChange={handleFilterChange} className="border px-2 py-1">
          <option value="std_code">เรียงตามรหัส</option>
          <option value="name_th">เรียงตามชื่อ</option>
        </select>
        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Export Excel</button>
        <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">พิมพ์</button>
      </div>

      {/* Table */}
      <table className="table-auto w-full border border-gray-300 print:text-xs">
        <thead className="bg-gray-100">
          <tr className='text-left'>
            <th className="border px-2 py-1">ลำดับ</th>
            <th className="border px-2 py-1">รหัส</th>
            <th className="border px-2 py-1">ชื่อ-สกุล</th>
            <th className="border px-2 py-1">รูป</th>
            <th className="border px-2 py-1">คณะ</th>
            <th className="border px-2 py-1">สาขา</th>
            <th className="border px-2 py-1">เกียรตินิยม</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.std_code}>
              <td className="border px-2 py-1 text-center">{(page - 1) * pageSize + idx + 1}</td>
              <td className="border px-2 py-1">{row.std_code}</td>
              <td className="border px-2 py-1">{row.name_th}</td>
              <td className="border px-2 py-1">
              <img
  src={row.img ? `/uploads/${row.img}` : '/blank.png'}
  alt={row.name_th}
  className="w-12 h-12 object-cover rounded"
/>

              </td>
              <td className="border px-2 py-1">{row.faculty}</td>
              <td className="border px-2 py-1">{row.program}</td>
              <td className="border px-2 py-1">{row.note}</td>
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
