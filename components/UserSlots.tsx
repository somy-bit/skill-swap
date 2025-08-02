'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';



export default function UserSlots({ userId }: { userId: string }) {
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [timesForSelectedDate, setTimesForSelectedDate] = useState<string[]>([]);

    useEffect(() => {
        const fetchSlots = async () => {
            const res = await fetch(`/api/availability/${userId}`);
            const data = await res.json();
            setAvailableSlots(data);
        };
        fetchSlots();
    }, [userId]);

    const tileDisabled = ({ date }: { date: Date }) => {
        const formatted = format(date, 'yyyy-MM-dd');

        return !availableSlots.some(slot => slot.date === formatted);

    };

    // react-calendar's Value type is Date | [Date, Date] | null
    // const onDateChange = (
    //     value: Value,
    //     event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
    // ) => {
    //     if (value instanceof Date) {
    //         setSelectedDate(value);
    //         const formatted = format(value, 'yyyy-MM-dd');
    //         const times = availableSlots
    //             .filter(slot => slot.date === formatted)
    //             .map(slot => slot.time);
    //         setTimesForSelectedDate(times);
    //     } else {
    //         setSelectedDate(null);
    //         setTimesForSelectedDate([]);
    //     }
    // };

    const handleBooking = async (time: string) => {
        const res = await fetch('/api/book-session', {
            method: 'POST',
            body: JSON.stringify({
                mentorId: userId,
                date: format(selectedDate!, 'yyyy-MM-dd'),
                time,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) alert('Booked successfully!');
    };

    return (
        <div className="space-y-4">
            <Calendar
                onChange={(value, event) => {
                    if (value instanceof Date) {
                        setSelectedDate(value);
                        const formatted = format(value, 'yyyy-MM-dd');
                        const times = availableSlots
                            .filter(slot => slot.date === formatted)
                            .map(slot => slot.time);
                        setTimesForSelectedDate(times);
                    } else {
                        setSelectedDate(null);
                        setTimesForSelectedDate([]);
                    }
                }}
                tileDisabled={({ date }) => {
                    const formatted = format(date, 'yyyy-MM-dd');
                    return !availableSlots.some(slot => slot.date === formatted);
                }}
                 className='dark:bg-gray-700 dark:text-gray-800'
            />

            {selectedDate && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">
                        Available Times on {format(selectedDate, 'PPP')}:
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {timesForSelectedDate.length > 0 ? (
                            timesForSelectedDate.map((time, i) => (
                                <button
                                    key={i}
                                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={() => handleBooking(time)}
                                >
                                    {time}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500">No available time slots.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
