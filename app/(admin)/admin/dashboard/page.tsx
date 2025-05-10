"use client";
import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#c084fc", "#fb923c"];

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    totalGraduates: 0,
    totalRegistered: 0,
    totalNotRegistered: 0,
    totalSurvey: 0,
    totalNotSurvey: 0,
    costOptions: { ปกติ: 0, เช่าชุดครุย: 0, ตัดชุดครุย: 0 },
  });

  useEffect(() => {
    setTimeout(() => {
      setSummary({
        totalGraduates: 1000,
        totalRegistered: 850,
        totalNotRegistered: 150,
        totalSurvey: 700,
        totalNotSurvey: 300,
        costOptions: { ปกติ: 400, เช่าชุดครุย: 300, ตัดชุดครุย: 150 },
      });
    }, 500);
  }, []);

  const registrationChart = [
    { name: "ลงทะเบียนแล้ว", value: summary.totalRegistered },
    { name: "ยังไม่ลงทะเบียน", value: summary.totalNotRegistered },
  ];

  const surveyChart = [
    { name: "กรอกแบบสอบถามแล้ว", value: summary.totalSurvey },
    { name: "ยังไม่กรอก", value: summary.totalNotSurvey },
  ];

  const costOptionChart = Object.entries(summary.costOptions).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">🎓 Admin Dashboard  (ข้อมูล mockup)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DashboardCard title="บัณฑิตทั้งหมด" value={summary.totalGraduates} color="bg-green-100" />
        <DashboardCard title="ลงทะเบียนแล้ว" value={summary.totalRegistered} color="bg-blue-100" />
        <DashboardCard title="ยังไม่ลงทะเบียน" value={summary.totalNotRegistered} color="bg-red-100" />
        <DashboardCard title="กรอกแบบสอบถามแล้ว" value={summary.totalSurvey} color="bg-yellow-100" />
        <DashboardCard title="ยังไม่กรอกแบบสอบถาม" value={summary.totalNotSurvey} color="bg-purple-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="สัดส่วนการลงทะเบียน (Pie Chart)" data={registrationChart} />
        <ChartCard title="สัดส่วนการกรอกแบบสอบถาม (Pie Chart)" data={surveyChart} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">📊 การเลือกรูปแบบการลงทะเบียน (Bar Chart)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costOptionChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

function DashboardCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`${color} p-4 rounded shadow`}>
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <p className="text-3xl text-gray-700">{value.toLocaleString()}</p>
    </div>
  );
}

function ChartCard({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
