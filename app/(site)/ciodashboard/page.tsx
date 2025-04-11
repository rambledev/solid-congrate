"use client"; // ใช้ client-side rendering

import React, { useState, useEffect } from 'react';

interface AttendanceItem {
    date: string;
    count: number;
}

const CioDashboard: React.FC = () => {
    const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
    const [graduates, setGraduates] = useState<number>(0);
    const [nonGraduates, setNonGraduates] = useState<number>(0);
    const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);

    useEffect(() => {
        // Mock data fetching here
        // Replace this with your API call
        setTotalRegistrations(1500);
        setGraduates(1200);
        setNonGraduates(300);
        setAttendanceData([
            { date: '2023-10-01', count: 150 },
            { date: '2023-10-02', count: 175 },
            { date: '2023-10-03', count: 200 },
            // Add more mock data as needed
        ]);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold mb-6">Dashboard for CIO</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-medium">จำนวน ผู้สำเร็จการศึกษา</h2>
                    <p className="text-xl">{totalRegistrations}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-medium">ลงทะเบียนเข้ารับปริญญา</h2>
                    <p className="text-xl">{graduates}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-medium">ลงทะเบียนไม่เข้ารับ</h2>
                    <p className="text-xl">{nonGraduates}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-4">เช็คชื่อเข้าพิธีซ้อม</h2>
            <table className="min-w-full bg-white rounded shadow border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 text-left">วันที่</th>
                        <th className="py-2 px-4 text-left">จำนวนผู้เข้าซ้อม</th>
                        <th className="py-2 px-4 text-left">ขาด</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((item) => (
                        <tr key={item.date} className="border-b">
                            <td className="py-2 px-4 text-left">{item.date}</td>
                            <td className="py-2 px-4 text-left">{item.count}</td>
                            <td className="py-2 px-4 text-left">{graduates-item.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CioDashboard;