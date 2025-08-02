'use client'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ToggleDarkMode from './ToggleDarkMode'
import { useUser } from '@clerk/nextjs'
import { listenToNotifications } from '@/lib/utils'
import { Calendar, HomeIcon, ListCheck, MessageCircleCodeIcon, User2Icon } from 'lucide-react'

type Props = {
 
  isOpen:boolean;
};


function DashboardSidebar() {
  const {user} = useUser();
  const [notif,setNotif] = useState<string[]>()

 

   useEffect(() => {
    if(!user) return;
  const unsub = listenToNotifications(user.id, (notifs) => {
    setNotif(notifs); // updates UI
  });

  return () => unsub();
}, []);
 



  return (
       <div className="hidden md:flex w-64 h-screen fixed left-0 top-0">
                      
                    {/* Sidebar */}
                    <aside className=" w-full  min-h-screen dark:bg-gray-900 bg-indigo-900 text-white flex flex-col items-center text-center space-y-6 p-6">
                        <h1 className="text-2xl font-bold mb-10">SkillSwap</h1>
                        <ToggleDarkMode />
                         <div className=" flex">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                        <nav className="flex flex-col space-y-4 items-start flex-grow">
                            <Link href="/dashboard" className="hover:text-indigo-300 text-xl flex flex-row items-center space-x-3 font-semibold transition ease-out">
                            <HomeIcon className='w-4 h-4'/>
                            <span>Home</span></Link>
                            <Link href="/dashboard/sessions" className="hover:text-indigo-300  flex flex-row items-center space-x-3 text-xl font-semibold transition ease-out">
                            <MessageCircleCodeIcon className='w-4 h-4'/>
                            <span>Messages</span></Link>
                            {
                              user &&
                            <Link href={`/dashboard/profile/${user.id}`} className="hover:text-indigo-300 flex flex-row items-center space-x-3 text-xl font-semibold transition ease-out">
                              <User2Icon className='w-4 h-4'/>
                              <span>Profile</span></Link>

                            }
                            <Link href="/dashboard/sessions" className="hover:text-indigo-300 flex flex-row items-center space-x-3 text-xl font-semibold transition ease-out">
                           <ListCheck className='w-4 h-4'/>
                           <span>Sessions {notif?.length}</span></Link>
                            <Link href="/dashboard/schedule" className="hover:text-indigo-300 flex flex-row items-center space-x-3 text-xl font-semibold transition ease-out">
                            <Calendar className='h-4 w-4'/>
                            <span>Schedule</span></Link>
                        </nav>
                       
                    </aside>

                  
                </div>
  )
}

export default DashboardSidebar