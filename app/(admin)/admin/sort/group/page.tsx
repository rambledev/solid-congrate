'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const groupOptions = [
  'กลุ่ม 1','กลุ่ม 2','กลุ่ม 3','กลุ่ม 4','กลุ่ม 5',
  'กลุ่ม 6','กลุ่ม 7','กลุ่ม 8','กลุ่ม 9','กลุ่ม 10',
  'กลุ่ม 11','กลุ่ม 12','กลุ่ม 13','กลุ่ม 14','กลุ่ม 15',
  'กลุ่ม 16','กลุ่ม 17','กลุ่ม 18','กลุ่ม 19','กลุ่ม 20',
  'กลุ่ม พิเศษ'
];

export default function GroupPage() {
  const [students, setStudents] = useState([]);
  const [facTypes, setFacTypes] = useState<string[]>([]);
  const [faculties, setFaculties] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    fac_type: '',
    faculty: '',
    program: ''
  });
  const [bulkGroup, setBulkGroup] = useState('');

  // โหลดตัวเลือกการค้นหาเมื่อเปิดหน้า
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/students/option');
        const data = await res.json();
        setFacTypes(data.facTypes);
        setFaculties(data.faculties);
        setPrograms(data.programs);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดตัวเลือกการค้นหาได้',
        });
      }
    };

    fetchOptions();
  }, []);

  const fetchStudents = async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    try {
      const res = await fetch(`/api/students/groups?${params.toString()}`);
      const data = await res.json();
      setStudents(data.students);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูล นศ. ได้',
      });
    }
  };

  const showToast = (text: string, icon: 'success' | 'error') => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      icon,
      title: text
    });
  };

  const saveGroup = async (std_code: string, group_name: string) => {
    try {
      const res = await fetch('/api/students/group/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ std_codes: std_code, group_name }),
      });

      if (res.ok) {
        fetchStudents();
        showToast('บันทึกกลุ่มเรียบร้อยแล้ว', 'success');
      } else {
        showToast('เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch {
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
  };

  const saveGroupBulk = async () => {
    const stdCodes = students.map((s: any) => s.std_code);
    if (stdCodes.length === 0) {
      showToast('ไม่พบรายชื่อในการกำหนดกลุ่ม', 'error');
      return;
    }
    try {
      const res = await fetch('/api/students/group/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ std_codes: stdCodes, group_name: bulkGroup }),
      });

      if (res.ok) {
        fetchStudents();
        showToast('บันทึกกลุ่มทั้งหมดเรียบร้อยแล้ว', 'success');
      } else {
        showToast('เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch {
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">กำหนดกลุ่มบัณฑิต</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="ค้นหาชื่อ-สกุล"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <select
          value={filters.fac_type}
          onChange={(e) => setFilters({ ...filters, fac_type: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">-- วุฒิบัณฑิต --</option>
          {facTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={filters.faculty}
          onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">-- คณะ --</option>
          {faculties.map((fac, idx) => (
            <option key={idx} value={fac}>{fac}</option>
          ))}
        </select>
        <select
          value={filters.program}
          onChange={(e) => setFilters({ ...filters, program: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="">-- สาขา --</option>
          {programs.map((prog, idx) => (
            <option key={idx} value={prog}>{prog}</option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchStudents}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        🔍 ค้นหา
      </button>

      {students.length > 0 && (
        <div className="flex gap-4 mb-4 items-center">
          <select
            value={bulkGroup}
            onChange={(e) => setBulkGroup(e.target.value)}
            className="border p-2 rounded w-1/3"
          >
            <option value="">-- เลือกกลุ่มสำหรับทั้งหมด --</option>
            {groupOptions.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
          <button
            onClick={saveGroupBulk}
            disabled={!bulkGroup}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            กำหนดกลุ่มทั้งหมด
          </button>
        </div>
      )}

      {students.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          กรุณากรอกเงื่อนไขแล้วกดปุ่มค้นหาเพื่อแสดงข้อมูล
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">รหัส</th>
              <th className="border p-2">ลำดับปริญญา</th>
              <th className="border p-2">ลำดับแถว</th>
              <th className="border p-2">ชื่อ-สกุล</th>
              <th className="border p-2">วุฒิบัณฑิต</th>
              <th className="border p-2">คณะ</th>
              <th className="border p-2">สาขา</th>
              <th className="border p-2">กลุ่มปัจจุบัน</th>
              <th className="border p-2">กำหนดกลุ่ม</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student: any) => (
              <tr key={student.std_code}>
                <td className="border p-2">{student.std_code}</td>
                <td className="border p-2">{student.fix_num}</td>
                <td className="border p-2">{student.num}</td>
                <td className="border p-2">{student.name_th}</td>
                <td className="border p-2">{student.fac_type}</td>
                <td className="border p-2">{student.faculty}</td>
                <td className="border p-2">{student.program}</td>
                <td className="border p-2">{student.group_name || '-'}</td>
                <td className="border p-2">
                  <select
                    defaultValue=""
                    onChange={(e) => saveGroup(student.std_code, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">-- เลือกกลุ่ม --</option>
                    {groupOptions.map((g, idx) => (
                      <option key={idx} value={g}>{g}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
