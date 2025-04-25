'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'มกราคม', registered: 300 },
  { name: 'กุมภาพันธ์', registered: 200 },
  { name: 'มีนาคม', registered: 450 },
  { name: 'เมษายน', registered: 380 },
]

export default function AdminChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="registered" fill="#166534" />
      </BarChart>
    </ResponsiveContainer>
  )
}
