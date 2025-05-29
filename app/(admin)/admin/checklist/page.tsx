'use client';

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// ✅ กำหนดชนิดของข้อมูลใน checklist
interface ChecklistItem {
  id: string;
  name: string;
  std_code: string;
  timestamp: string;
  check_by: string;
}

const ChecklistPage = () => {
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchChecklistData = async () => {
    try {
      const response = await fetch('/api/checklist');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setChecklistData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklistData();
    const interval = setInterval(fetchChecklistData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return date
      .toLocaleString('th-TH', options)
      .replace(',', '')
      .replace(/\//g, '-');
  };

  const filteredData = checklistData.filter((item) => {
    if (!selectedDate) return true;
    const itemDate = new Date(item.timestamp).toLocaleDateString();
    return itemDate === selectedDate.toLocaleDateString();
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(document.querySelector('table')?.outerHTML || '');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, 'Checklist');
    const excelBuffer = XLSX.write(wb, { bookType: 'xls', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.ms-excel' });
    saveAs(data, 'checklist.xlsx');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checklist</h1>

      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <div className="mb-4">
        <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={filteredData.length}>All</option>
        </select>
      </div>

      <div className="mb-4">
        <button 
          onClick={handlePrint}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Print
        </button>
        <button 
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Export to Excel
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 border border-gray-300">No.</th>
            <th className="py-2 border border-gray-300">ชื่อ-สกุล</th>
            <th className="py-2 border border-gray-300">รหัสนักศึกษา</th>
            <th className="py-2 border border-gray-300">ทำรายการเมื่อ</th>
            <th className="py-2 border border-gray-300">Check By</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="py-2 border border-gray-300 text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="py-2 border border-gray-300 text-center">{item.name}</td>
              <td className="py-2 border border-gray-300 text-center">{item.std_code}</td>
              <td className="py-2 border border-gray-300 text-center">{formatDateTime(item.timestamp)}</td>
              <td className="py-2 border border-gray-300 text-center">{item.check_by}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)} 
          className="mr-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)} 
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="mt-4 text-center">
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
      </div>
    </div>
  );
};

export default ChecklistPage;
