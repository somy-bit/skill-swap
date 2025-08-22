'use client'

import { SignedIn, UserButton } from '@clerk/nextjs'
import { MenuIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import ToggleDarkMode from './ToggleDarkMode';
import { useUser } from '@clerk/nextjs'

function Header() {

    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const {user} = useUser();

    return (
        <>
            <header className={`flex fixed top-0 z-50 md:hidden w-full h-[60px] bg-indigo-400 dark:bg-gray-900  text-gray-700 shadow-sm p-3  items-center justify-between `}>


                <div>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                <button className='cursor-pointer '
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    <MenuIcon className='h-8 w-8 text-gray-800 dark:text-white' />
                </button>


            </header>

            <div className={`fixed top-0 right-0 md:hidden transition-transform duration-500 ease-in-out transform ${openMenu ? "translate-x-0" : "translate-x-full"
                } h-screen w-full bg-indigo-400 dark:bg-gray-900 z-40`}>
                <div className='flex flex-col space-y-8 mt-[70px]'>
                    <div className='flex items-center justify-center'>
                        <ToggleDarkMode />
                    </div>

                    <nav className="flex flex-col space-y-8 flex-grow">
                        <button onClick={() => { router.replace('/dashboard'); setOpenMenu(false); }} className="hover:text-indigo-300 cursor-pointer text-xl font-semibold transition ease-out">Home</button>
                        <button onClick={() => { router.replace('/dashboard/sessions'); setOpenMenu(false) }} className="hover:text-indigo-300 cursor-pointer text-xl font-semibold transition ease-out">Sessions</button>
                        <button onClick={() => { router.replace(`dashboard/profile/${user?.id}`); setOpenMenu(false) }} className="hover:text-indigo-300 cursor-pointer text-xl font-semibold transition ease-out">Profile</button>
                        <button onClick={() => { router.replace('dashboard/notifications'); setOpenMenu(false) }} className="hover:text-indigo-300 cursor-pointer text-xl font-semibold transition ease-out">Notifications</button>
                        <button onClick={() => { router.replace('/dashboard/schedule'); setOpenMenu(false); }} className="hover:text-indigo-300 cursor-pointer text-xl font-semibold transition ease-out">Schedule</button>
                    </nav>
                </div>

            </div>

        </>

    )
}

export default Header