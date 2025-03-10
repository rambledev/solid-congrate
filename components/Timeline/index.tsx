import React from "react";

type Event = {
  date: string;
  description: string;
};

const events: Event[] = [
  { date: "1 เม.ย. 2568", description: "เปิดลงทะเบียนและชำระเงิน" },
  { date: "10 เม.ย. 2568", description: "ปิดลงทะเบียนและปิดรับชำระเงิน" },
  { date: "11 เม.ย. 2568", description: "ซ้อมใหญ่ วันที่ 1" },
  { date: "12 เม.ย. 2568", description: "ซ้อมใหญ่ วันที่ 2" },
  { date: "13 เม.ย. 2568", description: "ซ้อมใหญ่ วันที่ 3" },
  { date: "15 เม.ย. 2568", description: "วันรับพระราชทานปริญญาบัตร" },
];

const GraduationSchedule: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">กำหนดการรับปริญญา</h2>
      <ul className="space-y-2">
        {events.map((event, index) => (
          <li key={index} className="flex justify-between p-2 bg-gray-100 rounded">
            <span className="font-medium">{event.date}</span>
            <span>{event.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraduationSchedule;
