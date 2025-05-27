interface ChartsProps {
  registrationStatus?: { registered: number; not_registered: number }
  surveyStatus?: { surveyed: number; not_surveyed: number }
  graduationStatus?: Record<'1' | '2' | '3' | '4', number>
}

export default function Charts({
  registrationStatus = { registered: 0, not_registered: 0 },
  surveyStatus = { surveyed: 0, not_surveyed: 0 },
  graduationStatus = { '1': 0, '2': 0, '3': 0, '4': 0 },
}: ChartsProps) {
  const pieChartData = [
    {
      title: 'สถานะการลงทะเบียน',
      total: registrationStatus.registered + registrationStatus.not_registered,
      data: [
        { name: 'ลงทะเบียนแล้ว', value: registrationStatus.registered, color: 'rgb(34 197 94)' },
        { name: 'ยังไม่ลงทะเบียน', value: registrationStatus.not_registered, color: 'rgb(239 68 68)' },
      ]
    },
    {
      title: 'สถานะแบบสอบถาม',
      total: surveyStatus.surveyed + surveyStatus.not_surveyed,
      data: [
        { name: 'กรอกแล้ว', value: surveyStatus.surveyed, color: 'rgb(59 130 246)' },
        { name: 'ยังไม่กรอก', value: surveyStatus.not_surveyed, color: 'rgb(251 191 36)' },
      ]
    },
    {
      title: 'สถานะการเข้ารับปริญญา',
      total: graduationStatus['1'] + graduationStatus['2'] + graduationStatus['3'] + graduationStatus['4'],
      data: [
        { name: 'ลงทะเบียนเข้ารับ', value: graduationStatus['1'], color: 'rgb(96 165 250)' },
        { name: 'เข้ารับ + เช่าชุด', value: graduationStatus['2'], color: 'rgb(59 130 246)' },
        { name: 'เข้ารับ + ตัดชุด', value: graduationStatus['3'], color: 'rgb(29 78 216)' },
        { name: 'ไม่เข้ารับ', value: graduationStatus['4'], color: 'rgb(252 165 165)' },
      ]
    }
  ]

  const PieChart = ({ data, total }: { data: { name: string; value: number; color: string }[], total: number }) => {
    const radius = 60
    const centerX = 80
    const centerY = 80
    let cumulativeAngle = 0

    return (
      <div className="relative flex justify-center">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="16"
          />
          {data.map((d, index) => {
            const angle = (d.value / total) * 360
            const startAngle = cumulativeAngle
            const endAngle = cumulativeAngle + angle

            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            cumulativeAngle += angle

            return (
              <path
                key={index}
                d={pathData}
                fill={d.color}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-base lg:text-lg font-bold">รวม</div>
            <div className="text-lg lg:text-xl font-bold">{total.toLocaleString()}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {pieChartData.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-lg shadow-sm ${idx === 2 ? 'xl:col-span-2' : ''}`}
          >
            <h3 className="text-base lg:text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-4 lg:mb-6">ข้อมูลทั้งหมด</p>
            <div className="flex items-center justify-center mb-4 lg:mb-6">
              <PieChart data={item.data} total={item.total} />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {item.data.map((d, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-sm truncate">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
