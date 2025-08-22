'use client';

import {  useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookingCalendar from '@/components/BookingCalendar';
import { useSearchParams } from 'next/navigation';
import SelectPicker from '@/components/SelectPicker';
import { Session } from '@/types/type';
import {useUser } from '@clerk/nextjs';
import { toast } from 'react-toastify';


type SlotsByDate = { [date: string]: [string, string][] };

export default function BookPage() {



  const { userId } = useParams() as { userId: string };
  const [availableSlots, setAvailableSlots] = useState<SlotsByDate>({});
  const searchParams = useSearchParams();
  const name: string = searchParams.get('name') as string
  const skills: string[] = searchParams.getAll('skills') as string[]
  const [isBooking,setIsBooking] = useState(false);
  const mentorId :string =searchParams.get('id') as string;

  console.log('usrId...',userId)
  const{user} = useUser()

  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [selectedDate,setSelectedDate] = useState('');
  const [selectedSlot,setSelectedSlot] = useState<[string,string]|null>()

 


  useEffect(() => {
    const loadSlots = async () => {
      try {
        const res = await fetch(`/api/availability/${userId}`);
        const data = await res.json();
        setAvailableSlots(data.slots || {});
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      }
    };

    loadSlots();
  }, [userId]);


  //handling message input change

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }


  const handleSlotSelect = (date: string, time: [string, string]) => {
    console.log(`Selected slot: ${date} at ${time}`);
    setSelectedDate(date);
    setSelectedSlot(time);

  };

  const handleBook = async()=>{

    if(!selectedSlot || !selectedDate || selectedDate === ''||
     !message || message ==='' || !selectedSkill || selectedSkill === ''){

      toast.error('please fill the form complietely')
       return 
    }
     

    if(user){
      const sessionInfo:Session ={
        menteeId:user.id,
        mentorId:mentorId,
        date:selectedDate,
        startTime:selectedSlot[0],
        endTime:selectedSlot[1],
        message:message,
        status:'pending',
        skill:selectedSkill
      }
    

    setIsBooking(true)
    try{
      console.log('booking')
      const book = await fetch('/api/sessions/book',{
        method:'POST',
        body:JSON.stringify(sessionInfo)
      })

      console.log('successfully booked the session')
      setMessage('')
      setSelectedDate('')
      setSelectedSkill('')
      setSelectedSlot(null)

    }catch(error){
      console.log(error)
      toast.error('failed to book')
    }finally{
      setIsBooking(false)
    }
  }
  }

  return (
    <div className="max-w-xl mx-auto pt-8 pb-20 p-4">
      <div className='flex flex-col space-y-10'>
        <div>
          <h1 className="text-lg dark:text-gray-200  mb-4">Book a Session With   <span className="text-2xl text-indigo-900 dark:text-white font-bold mx-4 mb-4">{name} </span> </h1>
        </div>

        <BookingCalendar availableSlots={availableSlots} onSlotSelect={handleSlotSelect} />
        <div className='w-full flex space-y-6 flex-col p-4 '>

          <SelectPicker
            label='Choose a Skill :'
            options={skills}
            onChange={(value) => setSelectedSkill(value)}
          />
          <div className='flex flex-col space-y-3 items-start'>
            <label className='font-medium'>Write a message for {name}</label>

            <input
              type='text'
              value={message}
              onChange={handleChange}
              className='w-full p-2 rounded dark:text-gray-900 bg-white shadow-lg focus:outline-none focus:shadow-xl'
              placeholder='Write a message'
            />
          </div>

          <button 
          onClick={handleBook}
          className='bg-indigo-700 rounded p-2 hover:bg-indigo-900 cursor-pointer text-white mt-10'>
            Book 
          </button>


        </div>
      </div>
    </div>
  );
}
