import { Slot } from '@/types/type'
import { Trash2Icon } from 'lucide-react'
import React from 'react'

function SlotRow({date,onClick}:{date:Slot,onClick:(id:string)=>void}) {
  return (
    <div className='w-full px-8'>
        <div className='flex p-4 flex-row justify-between bg-white shadow-lg rounded-lg dark:bg-black'>
            <div className='flex flex-row space-x-4 items-center'>
                <p>{date.date}</p>
                <p className='text-teal-500'>{`${date.startTime}-${date.endTime}`}</p>
                <p className='text-sm'>{date.isBooked?"Booked":"Open"}</p>
            </div>
            <button className='cursor-pointer' onClick={()=>onClick(date.id!)}>
                <Trash2Icon className='text-red-400 w-4 h-4'/>
            </button>
        </div>
    </div>
  )
}

export default SlotRow