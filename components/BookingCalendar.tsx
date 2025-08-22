// components/CalendarGrid.tsx
'use client';

import { useState } from 'react';
import CalendarCell from './CalendarCell';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  availableSlots: { [date: string]: [string, string][] }; // YYYY-MM-DD → time slots
  onSlotSelect?: (date: string, time: [string, string]) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BookingCalendar({ availableSlots, onSlotSelect }: CalendarGridProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedSlot,setSelectedSlot] = useState<[string,string]>()


  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  

  const handleNextMonth = () => {

    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear(y => y + 1)
        return 0
      }
      return prev + 1
    })
  }



  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const offset = new Date(currentYear, currentMonth, 1).getDay();
  const dates: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) dates.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(currentYear, currentMonth, i));
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-CA');
    console.log('available slots', availableSlots)
    if (availableSlots[dateStr] && availableSlots[dateStr].length > 0) {
      setSelectedDate(dateStr);
    

    }
  };

  return (
    <div>
    
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={handleNextMonth}>
          <ChevronRight className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['SUN', 'MON', 'THU', 'WED', 'THR', 'FRI', 'SAT'].map((d) => (
          <div key={d} className="text-center font-semibold text-gray-500">
            {d}
          </div>
        ))}
        {dates.map((date, index) => {
          
          if (!date) return <div key={index} className="w-10 h-10" />;
           const dateStr = date.toLocaleDateString('en-CA');
           console.log('Date:', dateStr, 'Available:', availableSlots.hasOwnProperty(dateStr));

          const isAvailable = availableSlots[dateStr] ? true : false;
          return (
            <CalendarCell
              key={index}
              date={date}
              isDisabled={!isAvailable || date < new Date(new Date().toDateString())}
              isSelected={selectedDate === dateStr}
              onClick={handleDateClick}
            />
          );
        })}
      </div>
      {
        Object.keys(availableSlots).length === 0 &&(
          <p className='mt-10 text-sm font-semibold text-red-500'>There is no availability yet..</p>
        )
      }

      {selectedDate && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-bold"><span>Available Times on </span> <span className='ml-3 text-lg text-indigo-500'>{selectedDate}</span></h3>
          <div className="flex flex-row overflow-x-scroll p-3 max-w-3xl gap-2">
            {availableSlots[selectedDate]?.map((time, index) => {
             
              return (
                <button
                  key={index}
                  onClick={() => {onSlotSelect?.(selectedDate, time);console.log("selcted date and time",time+":"+selectedDate);setSelectedSlot(time);}}
                  className={`${(selectedSlot===time)?"border-2 border-teal-400":"" } px-3 py-1 rounded bg-white shadow-md dark:bg-black dark:shadow-gray-500 cursor-pointer hover:shadow-lg`}
                >
                {time[0]}-{time[1]}
                </button>)
            })}
          </div>
        </div>
      )}

      
    </div>
  );
}
