import React from 'react';

const HorizontalTimelineCustom = () => {
  const events = [
    { date: '07-08-2025 ถึง 10-08-2025', title: '1.ลงทะเบียน', status: 'active' },
    { date: '07-08-2025 ถึง 20-08-2025', title: '2.ชำระเงิน', status: 'inactive' },
  ];

  return (
    <div className="flex items-center overflow-x-auto p-5 bg-gray-100 rounded-lg">
      {events.map((event, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center relative mx-5">
            <div className={`w-5 h-5 rounded-full ${event.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col items-center ml-3">
              <div className="text-xs mb-1">{event.date}</div>
              <div className="text-lg font-bold">{event.title}</div>
            </div>
          </div>
          {index < events.length - 1 && (
            <div className={`w-12 h-0.5 ${events[index + 1].status === 'active' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HorizontalTimelineCustom;