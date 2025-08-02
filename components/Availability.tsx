// components/AvailabilityCalendar.tsx
'use client';

import { Slot } from '@/types/type';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SlotRow from './SlotRow';
import { useUser } from '@clerk/nextjs';
import { isEndTimeAfterStart } from '@/lib/utils';

export default function Availability() {
    const [date, setDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [slots, setSlots] = useState<Slot[]>([])
    const [refreshKey, setRefreshKey] = useState(0)

    const { user } = useUser();

    //getting all picked time slots
    useEffect(() => {

        const fetchslots = async () => {
            try {
                const res = await fetch('/api/availability');

                if (res.status === 200) {

                    const slotsData = await res.json()
                    setSlots(slotsData.slots)
                    console.log(slotsData.slots[0])

                } else {

                    throw new Error()

                }
            } catch (error) {
                console.log(error)
            }


        }

        fetchslots()

    }, [refreshKey])

    //delete a time slot
    const deleteSlot= async (id: string) => {
        if (user) {
            try {

                const res = await fetch(`/api/availability/${user.id}/slots/${id}`, {
                    method: 'DELETE',
                });
                if (res.status === 200) {
                    setSlots(prev => prev.filter(slot => slot.id !== id));
                } else {
                    console.error('Failed to delete slot');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };


    const handleSubmit = async () => {
      
        if (!date || !startTime || !endTime){
            setMessage('Please Select Valid Date And Start And Ent Time!')

            return;
        } 

        if(!isEndTimeAfterStart(startTime,endTime)){

            setMessage("the end time is before start time please choose a valid end time!")
            return;
        }

        const res = await fetch('/api/availability', {
            method: 'POST',
            body: JSON.stringify({
                date: date.toISOString().split('T')[0], // YYYY-MM-DD
                startTime,
                endTime,
            }),
        });

        const result = await res.json();
        if (res.ok) {
            setMessage('Slot saved!');
            setRefreshKey(prev => prev + 1)
            setEndTime('')
            setStartTime('')
        } else {
            setMessage(result.error || 'Error saving slot');
        }
    };

  

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2'>
            <div className="space-y-12 p-12 dark:bg-gray-800 ">
                <h2 className="text-xl font-semibold">Set Your Available Time</h2>
                <div className='flex flex-col items-center space-y-10'>


                    <Calendar
                        onChange={(value) => {
                            if (value instanceof Date) {
                                setDate(value);
                            } else if (Array.isArray(value) && value[0] instanceof Date) {
                                setDate(value[0]);
                            } else {
                                setDate(null);
                            }

                            setMessage("")
                        }}
                        minDate={new Date()}

                        value={date}
                        className='dark:bg-gray-700 dark:text-gray-800'
                    />
                    <div className="flex gap-4 ">
                        <div className='flex flex-row items-center justify-center  space-x-2 dark:text-white'>
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="border px-2 py-1 rounded dark:text-white"
                            />
                        </div>
                        <div className={`${startTime == '' ? "hidden":"flex"} flex-row items-center justify-center  space-x-2 dark:text-white`}>
                            <label>End Time</label>
                            <input
                            lang='en-GB'
                                type="time"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="border px-2 py-1 rounded "
                                min={startTime}
                                disabled={!startTime}
                            />
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className="bg-black text-white px-4 py-2  cursor-pointer rounded"
                    >
                        Save Slot
                    </button>
                    {message && <p className="text-green-600">{message}</p>}

                </div>
            </div>

            <div className='flex flex-col md:h-screen md:overflow-y-scroll space-y-4 py-20'>
                <h1 className='text-lg font-semibold w-full text-center'>Current Picked Time Slots</h1>
                {slots && slots?.map((slot, index) => (
                    <SlotRow
                        date={slot}
                        onClick={deleteSlot}
                        key={index}

                    />
                ))}
           
            </div>
        </div>
    );
}
