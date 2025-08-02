
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'
import HowModal from './HowModal'
import { notFound, redirect } from 'next/navigation'


async function Hero() {

    const user = await currentUser();

    if(user){
        redirect('/dashboard')
    }


    return (
        <section className='min-h-screen flex flex-col items-center justify-center text-center  p-2 bg-gradient-to-br from-indigo-200 to-white'>
            <div className='fixed top-0 w-full flex flex-row items-center justify-between p-2'>
                <Link className='text-2xl  text-gray-900' href='/'>SkillSwap</Link>
                <HowModal />
            </div>
            <h1 className='text-3xl lg:text-5xl font-bold mb-4 text-gray-900 '>Find your next micro-mentor in minutes.</h1>
            <p className='text-lg text-gray-700 mb-6 max-w-md'>
                Find mentors. Share what you know. One 15-minute swap at a time.
            </p>
            <Link href='/sign-up' className='bg-indigo-600 text-white cursor-pointer px-6 py-3 rounded-lg hover:bg-indigo-700 transition'>
                Get Started
            </Link >

            
        </section>
    )
}

export default Hero