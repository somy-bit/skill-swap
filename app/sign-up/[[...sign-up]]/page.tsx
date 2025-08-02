'use client'
import React, { useEffect } from 'react'
import {   SignUp, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';


function SignUpPage() {

  const {user,isLoaded} = useUser();
  const router = useRouter();


  useEffect(()=>{
    if(user && isLoaded){
      router.replace('/dashboard')
    }
  },[user,isLoaded])

  return (
    <div className='min-h-screen flex items-center bg-white justify-center'>
     <SignUp />

    </div>
  )
}

export default SignUpPage