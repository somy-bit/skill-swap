'use client'
import React, { useState } from 'react'
import ExploreCard from '@/components/ExplorCard';
import { useSaveUser } from '@/hooks/saveUser';
import { useProfile } from '@/hooks/getProfiles';



function Dashboard() {

    const { saved, loading, error } = useSaveUser()

    const [filter, setFilter] = useState('');
    const { profiles, loadingProf, hasMore, loadProfiles } = useProfile(filter)





    return (
        <div className='w-full h-full px-4 py-2 flex flex-col space-y-12'>
            <h1 className='ml-12 text-2xl font-semibold'>SKILL SWAP</h1>
            <h2 className='mx-auto flex text-xl '>Browse through mentor to find your needed skills</h2>
            <div className='flex flex-row  mb-20 space-x-6 lg:mx-40'>
                <div
                    className='py-2 px-3  justify-items-center shadow-sm bg-white dark:bg-gray-900 rounded-lg'
                >
                    Select Filter
                </div>
                <input
                    type=''
                    value={filter}
                    name='filter'
                    onChange={(e) => setFilter(e.target.value)}
                    className='bg-white shadow-md dark:text-white dark:shadow-gray-500 text-black dark:bg-gray-900 p-3 focus:scale-105 rounded-lg focus:outline-none focus:shadow-lg transition-all duration-100 ease-in-out flex-1'
                    placeholder='Start filtering ..'
                />
            </div>
            <div className='grid grid-clos-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  justify-items-center md:justify-center max-w-6xl  auto-rows-fr  gap-4 px-6 mx-auto'>
                {
                    profiles?.map((profile, index) => (
                        <ExploreCard
                            name={profile.name || ''}
                            avatar={profile.avatar || ""}
                            role={profile.isMentor ? 'mentor' : 'mentee'}
                            bio={profile.bio}
                            skills={profile.skills}
                            key={index}
                            id={profile.userId || ""}
                        />
                    ))
                }
            </div>

            {!loadingProf && hasMore && (
                <button className='cursor-pointer text-sm' onClick={loadProfiles}>Load More</button>
            )}

        </div>
    )
}

export default Dashboard