interface DashboardStatsProps {
  degreeStats?: Record<string, number>
  honorStats?: Record<string, number>
}

const Card = ({ title, value, color }: { title: string; value: number; color: string }) => {
  const colorClass =
    color === 'red' ? 'bg-red-500' :
    color === 'blue' ? 'bg-blue-500' :
    color === 'green' ? 'bg-green-500' :
    color === 'yellow' ? 'bg-yellow-500' :
    'bg-gray-500'

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</div>
        </div>
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${colorClass}`} />
        </div>
      </div>
    </div>
  )
}

export default function DashboardStats({
  degreeStats = {},
  honorStats = {}
}: DashboardStatsProps) {
  const statList = [
    { title: 'ปริญญาตรี', value: degreeStats['ปริญญาตรี'] || 0, color: 'blue' },
    { title: 'ปริญญาโท', value: degreeStats['ปริญญาโท'] || 0, color: 'green' },
    { title: 'ปริญญาเอก', value: degreeStats['ปริญญาเอก'] || 0, color: 'yellow' },
    { title: 'เกียรตินิยมอันดับ 1', value: honorStats['เกียรตินิยมอันดับ 1'] || 0, color: 'red' },
    { title: 'เกียรตินิยมอันดับ 2', value: honorStats['เกียรตินิยมอันดับ 2'] || 0, color: 'gray' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {statList.map((item, index) => (
        <Card key={index} title={item.title} value={item.value} color={item.color} />
      ))}
    </div>
  )
}
