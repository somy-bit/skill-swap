'use client'
import { Profile } from '@/types/type'
import { Calendar1Icon, StarIcon } from 'lucide-react'

import Link from 'next/link'
import React, { useEffect } from 'react'

import { useState } from 'react'


function ProfileCard({ profile, canEdit }: { profile: Profile, canEdit: boolean }) {

  const [isOpen, setIsOpen] = useState(false);

  const [slots, setSlots] = useState<{ [date: string]: [startTime: string, endTime: string][] }>()

  useEffect(() => {


    const fetchSlots = async () => {
      try {
        let slots = await fetch(`/api/availability/${profile.userId}`);
        const slotJson = await slots.json();
        setSlots(slotJson.slots || {})
        console.log("profile schedule",slotJson)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSlots();
  }, [])

  const fallbak = '/fallbackuser.png'
  return (
    <div className='flex flex-col w-full min-h-screen md:h-screen'>

      <div className='flex flex-row h-1/7 justify-between items-center px-12 py-6'>
        {!canEdit && (
          <button type='button' onClick={()=>setIsOpen(true)}

            className='cursor-pointer text-gray-600 text-xs dark:text-white p-2 shadow-lg flex space-x-1 rounded-lg items-center' >

            <p>See When I Am Availabele</p><Calendar1Icon className='text-green-500 text-sm' />
          </button>
        )}

        <div>
          {canEdit &&
            <Link href='/dashboard/profile/edit'
              className='text-sm p-2 shadow-md hover:shadow-xl cursor-pointer rounded-lg'
            >Edit Profile</Link>
          }

        </div>
      </div>

      <div className='w-full  h-3/7'>
        <div className='w-3/4 h-full mx-auto flex md:flex-row flex-col space-y-8 md:items-center md:space-x-24'>
          <div className='items-center  justify-center'>

            <img
              src={profile.avatar && profile.avatar !== '' ? profile.avatar : fallbak}
              width={500}
              height={500}
              className='w-56 h-56 rounded-full object-center border-2 border-gray-200 shadow-md'
              alt='avatar'
            />
          </div>
          <div className='flex flex-col items-center md:items-start'>
            <h1 className='font-bold text-3xl text-gray-700 dark:text-white'>{profile.name}</h1>
            <h2 className='font-semibold text-xl text-gray-600 dark:text-gray-400'>{profile.isMentor ? "Mostly Mentoring" : "Mostly Seeking Skills"}</h2>

            <div className='flex flex-row items-center mt-3 md:mt-6'>
              <StarIcon className='text-yellow-300 w-4 h-4 ' />
              <StarIcon className='text-yellow-300 w-4 h-4' />
              <StarIcon className='text-yellow-300 w-4 h-4' />
              <StarIcon className='text-yellow-300 w-4 h-4' />
              <StarIcon className='text-yellow-300 w-4 h-4' />
            </div>
          </div>
        </div>
      </div>


      <div className='w-full h-3/7  mt-6 md:mt-3'>
        <div className='h-full w-full flex flex-col md:flex-row'>
          <div className='flex-1'>
            <h3 className='text-xl text-center font-semibold'>Skills I offer</h3>
            <div className='flex flex-row items-center gap-3 justify-center py-6 flex-wrap mx-8'>
              {profile.skills.map((skill, index) => (
                <div
                  className='flex justify-center items-center max-w-36 p-2 shadow-lg bg-white overflow-hidden rounded-lg  dark:bg-gray-900'
                  key={index}>
                  #{skill}
                </div>
              ))}

            </div>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl text-center font-semibold'>Skills I need</h3>
            <div className='flex flex-row items-center gap-3 justify-center py-6 flex-wrap mx-8'>
              {
                profile.skillsNeed.map((skill, index) => (
                  <div
                    className='flex justify-center items-center max-w-36 p-2 shadow-lg bg-white rounded-lg  dark:bg-gray-900'
                    key={index}>
                    {skill}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='bg-white dark:bg-gray-600 max-w-md w-full p-6 rounded-lg shadow-lg relative'>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              X
            </button>

            <div className='bg-black text-white p-10'>
              {slots && Object.entries(slots).map(([date, timeSpan],i) =>
              (
                <div>
                  <div key={i}>{date}</div>
                  <ul>
                    {(timeSpan && timeSpan.length > 0) &&
                      timeSpan.map(([st, et], i) => (
                        <li key={`${date}-${st}-${et}`}>{st}</li>
                      ))}



                  </ul>
                </div>
                    )
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileCard