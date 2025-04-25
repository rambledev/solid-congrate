"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "กรอกข้อมูล", value: 950 },
  { name: "แบบสอบถาม", value: 1100 },
  { name: "การเข้ารับ", value: 1200 },
];

const COLORS = ["#00b894", "#0984e3", "#6c5ce7"];

export default function Chart() {
  return (
    <div className="w-full h-80">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">แสดงผลสถานะ</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
