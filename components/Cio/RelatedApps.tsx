import { useState } from 'react'

const tabData = {
  'Top 7 days': [
    { name: 'Chrome', downloads: '9,124', trend: '+12%', trendUp: true },
    { name: 'Drive', downloads: '6,421', trend: '+8%', trendUp: true },
    { name: 'Dropbox', downloads: '4,321', trend: '-3%', trendUp: false },
    { name: 'Evernote', downloads: '3,218', trend: '+15%', trendUp: true },
    { name: 'Github Desktop', downloads: '2,987', trend: '+7%', trendUp: true }
  ],
  'Top 30 days': [
    { name: 'Chrome', downloads: '45,124', trend: '+18%', trendUp: true },
    { name: 'Drive', downloads: '32,421', trend: '+12%', trendUp: true },
    { name: 'Slack', downloads: '28,321', trend: '+9%', trendUp: true },
    { name: 'Dropbox', downloads: '24,218', trend: '+5%', trendUp: true },
    { name: 'Zoom', downloads: '19,987', trend: '+22%', trendUp: true }
  ],
  'All times': [
    { name: 'Chrome', downloads: '234,124', trend: '+25%', trendUp: true },
    { name: 'Drive', downloads: '187,421', trend: '+20%', trendUp: true },
    { name: 'Slack', downloads: '156,321', trend: '+15%', trendUp: true },
    { name: 'Dropbox', downloads: '143,218', trend: '+12%', trendUp: true },
    { name: 'Photoshop', downloads: '128,987', trend: '+8%', trendUp: true }
  ]
}

export default function RelatedApps() {
  const [activeTab, setActiveTab] = useState<keyof typeof tabData>('Top 7 days')

  const getAppIcon = (appName: string) => {
    const iconColors = {
      'Chrome': 'bg-yellow-500',
      'Drive': 'bg-blue-500',
      'Dropbox': 'bg-blue-600',
      'Slack': 'bg-purple-500',
      'Zoom': 'bg-blue-400',
      'Evernote': 'bg-green-500',
      'Github Desktop': 'bg-gray-800',
      'Photoshop': 'bg-blue-700'
    }
    
    const colorClass = iconColors[appName as keyof typeof iconColors] || 'bg-gray-400'
    
    return (
      <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
        {appName.charAt(0)}
      </div>
    )
  }

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
      <h3 className="text-base lg:text-lg font-semibold mb-4 lg:mb-6">Related applications</h3>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:space-x-6 sm:gap-0 border-b border-gray-200 mb-4 lg:mb-6 overflow-x-auto">
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as keyof typeof tabData)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Apps List */}
      <div className="space-y-3 lg:space-y-4">
        {tabData[activeTab].map((app, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {getAppIcon(app.name)}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 text-sm lg:text-base truncate">{app.name}</div>
                <div className="text-xs lg:text-sm text-gray-500">{app.downloads} downloads</div>
              </div>
            </div>
            
            <div className={`text-sm font-medium flex-shrink-0 ml-2 ${
              app.trendUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {app.trend}
            </div>
          </div>
        ))}
      </div>
      
      {/* View all link */}
      <div className="mt-4 lg:mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors">
          View all applications
        </button>
      </div>
    </div>
  )
}