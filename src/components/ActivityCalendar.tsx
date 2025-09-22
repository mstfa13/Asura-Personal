
import { useState } from 'react';

interface ActivityCalendarProps {
  month: string;
  year: number;
  activities: { [key: string]: boolean };
}

export default function ActivityCalendar({ month, year, activities }: ActivityCalendarProps) {
  const daysInMonth = new Date(year, new Date(Date.parse(month + " 1, 2024")).getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, new Date(Date.parse(month + " 1, 2024")).getMonth(), 1).getDay();
  
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weeks = [];
  
  let currentWeek = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  
  // Add the last week if it has days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{month} - {year}</h3>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, index) => (
          <div key={index} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div key={dayIndex} className="h-8 flex items-center justify-center">
                {day && (
                  <div className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                    activities[`${year}-${month}-${day}`]
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    {day}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
