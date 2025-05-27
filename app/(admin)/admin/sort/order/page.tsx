'use client'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

type Student = {
  num: number
  fix_num: string
  name_th: string
  group_name: string
  std_code: string
  note: string
  fac_type: string
}

export default function GroupSortPage() {
  const [groupList, setGroupList] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [students, setStudents] = useState<Student[] | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modalType, setModalType] = useState<'setOrder' | 'moveOrder' | 'moveGroup' | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [sortBy, setSortBy] = useState('default')

  const loadGroupList = async () => {
    const res = await fetch('/api/group-list')
    const data = await res.json()
    setGroupList(data)
  }
  
  useEffect(() => {
    loadGroupList()
  }, [])
  

  const handleShowList = async () => {
    const res = await fetch(`/api/group-members?group=${selectedGroup}&sort=${sortBy}`)
    const data = await res.json()
    setStudents(data)
    await loadGroupList()
  }
  

  

  const openModal = (student: Student, type: typeof modalType) => {
    setSelectedStudent(student)
    setModalType(type)
    setInputValue('')
    setSelectValue('')
  }

  const closeModal = () => {
    setModalType(null)
    setSelectedStudent(null)
  }

  const handleSaveCurrentOrder = async () => {
    if (!students || students.length === 0) return
  
    const dataToUpdate = students.map((student, index) => ({
      std_code: student.fix_num,
      new_num: index + 1, // ลำดับใหม่ เริ่มที่ 1
    }))
  
    try {
      const res = await fetch('/api/student/save-order-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: dataToUpdate }),
      })
  
      const result = await res.json()
  
      if (result?.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'บันทึกลำดับเรียบร้อยแล้ว',
          showConfirmButton: false,
          timer: 2000,
        })
        await handleShowList() // รีโหลดเพื่อให้ข้อมูลตรงฐานข้อมูล
      } else {
        throw new Error(result?.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'ไม่สามารถบันทึกลำดับได้',
        text: (error as Error).message,
        showConfirmButton: false,
        timer: 3000,
      })
    }
  }
  

  const handleSave = async () => {
    if (!selectedStudent) return

    try {
      let res

      if (modalType === 'setOrder') {
        res = await fetch('/api/student/set-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            std_code: selectedStudent.fix_num,
            new_num: parseInt(inputValue),
          }),
        })
      }

      if (modalType === 'moveOrder') {
        res = await fetch('/api/student/move-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            std_code_a: selectedStudent.fix_num,
            std_code_b: selectValue,
          }),
        })
      }

      if (modalType === 'moveGroup') {
        res = await fetch('/api/student/move-group', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            std_code: selectedStudent.fix_num,
            new_group: selectValue,
          }),
        })
      }

      const result = await res?.json()

      if (result?.success) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'ดำเนินการสำเร็จ',
          showConfirmButton: false,
          timer: 2000,
        })
      } else {
        throw new Error(result?.error || 'เกิดข้อผิดพลาด')
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'ดำเนินการไม่สำเร็จ',
        text: (error as Error).message,
        showConfirmButton: false,
        timer: 3000,
      })
    }

    closeModal()
    await handleShowList()
  }

  const newGroupOptions = [
    ...Array.from({ length: 20 }, (_, i) => `กลุ่ม ${i + 1}`),
    'กลุ่มพิเศษ',
  ]
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">จัดลำดับรายชื่อบัณฑิตตามกลุ่ม</h1>
  
      <div className="mb-4 flex gap-4 items-center">
        <label htmlFor="groupSelect">เลือกกลุ่ม:</label>
        <select
          id="groupSelect"
          className="border p-2 rounded"
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
        >
          <option value="">-- เลือกกลุ่ม --</option>
          {groupList.map((group, idx) => (
            <option key={idx} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
  
      <div className="flex gap-4 items-center mb-4">
        <label>เรียงลำดับ:</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="default">-- เรียงตามลำดับ --</option>
          <option value="honor">เรียงตามเกียรตินิยม</option>
          <option value="name">เรียงตามชื่อ ก-ฮ</option>
        </select>
      </div>
  
      <div className="mb-6">
        <button
          onClick={handleShowList}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
          disabled={!selectedGroup}
        >
          แสดงรายชื่อ
        </button>
  
        {(students?.length ?? 0) > 0 && (
          <button
            onClick={handleSaveCurrentOrder}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            บันทึกลำดับตามการจัดเรียงขณะนี้
          </button>
        )}
      </div>
  
      {students && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">ลำดับ</th>
                <th className="border px-2 py-1">ลำดับปริญญา</th>
                <th className="border px-2 py-1">วุฒิปริญญา</th>
                <th className="border px-2 py-1">ชื่อ-สกุล</th>
                <th className="border px-2 py-1">เกียรตินิยม</th>
                <th className="border px-2 py-1">กลุ่ม</th>
                <th className="border px-2 py-1">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">{student.num}</td>
                  <td className="border px-2 py-1 text-center">{student.fix_num}</td>
                  <td className="border px-2 py-1 text-center">{student.fac_type}</td>
                  <td className="border px-2 py-1">{student.name_th}</td>
                  <td className="border px-2 py-1">{student.note}</td>
                  <td className="border px-2 py-1 text-center">{student.group_name}</td>
                  <td className="border px-2 py-1 text-center space-y-1">
                    <button
                      onClick={() => openModal(student, 'setOrder')}
                      className="text-blue-600 hover:underline block"
                    >
                      กำหนดลำดับ
                    </button>
                    <button
                      onClick={() => openModal(student, 'moveOrder')}
                      className="text-green-600 hover:underline block"
                    >
                      ย้ายลำดับ
                    </button>
                    <button
                      onClick={() => openModal(student, 'moveGroup')}
                      className="text-purple-600 hover:underline block"
                    >
                      ย้ายกลุ่ม
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {/* Modal */}
      {modalType && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-md p-6 w-96 relative">
            <h2 className="text-lg font-semibold mb-4">
              {modalType === 'setOrder' && 'กำหนดลำดับ'}
              {modalType === 'moveOrder' && 'ย้ายลำดับ'}
              {modalType === 'moveGroup' && 'ย้ายกลุ่ม'}
            </h2>
  
            {modalType === 'setOrder' && (
              <input
                type="number"
                placeholder="ลำดับใหม่"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              />
            )}
  
            {modalType === 'moveOrder' && (
              <select
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
                className="border p-2 w-full mb-4 rounded"
              >
                <option value="">-- เลือกลำดับที่ต้องการ --</option>
                {students?.map(s => (
                  <option key={s.num} value={s.num}>
                    ลำดับ {s.num}
                  </option>
                ))}
              </select>
            )}
  
  {modalType === 'moveGroup' && (
  <select
    value={selectValue}
    onChange={e => setSelectValue(e.target.value)}
    className="border p-2 w-full mb-4 rounded"
  >
    <option value="">-- เลือกกลุ่มใหม่ --</option>
    {newGroupOptions.map((group, idx) => (
      <option key={idx} value={group}>
        {group}
      </option>
    ))}
  </select>
)}


  
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-1 rounded border">
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={
                  (modalType === 'setOrder' && !inputValue) ||
                  (modalType !== 'setOrder' && !selectValue)
                }
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  
}
