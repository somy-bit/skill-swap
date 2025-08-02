'use client'

import React, { useState } from 'react'

function HowModal() {
    const [isOpen, setIsOpen] = useState(false);
    return (

        <>
            <button
                onClick={() => setIsOpen(true)}
                className='px-2 py-1 bg-gray-100 shadow-md rounded-lg hover:bg-gray-200 text-gray-800 '
            >
                How
            </button>
            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
                    <div className='bg-white max-w-md w-full p-6 rounded-lg shadow-lg relative'>
                        <button
                        onClick={()=>setIsOpen(false)}
                        className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
                        >
                            X
                        </button>
                        <h2 className='text-xl font-semibold mb-4 text-gray-900'>How skillswpa works</h2>
                        <ul className='space-y-2 text-gray-700 list-disc pl-5'>
                            <li>Create your profile with skill yoou offer and want</li>
                            <li>Browse others open to mentoring</li>
                            <li>Send a 15-minute swap request</li>
                            <li>Chat ,schedule and grow together</li>
                           
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default HowModal