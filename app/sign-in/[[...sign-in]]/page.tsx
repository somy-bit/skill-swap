'use client'

import React, { useEffect } from 'react';
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';


function SignInPage() {
  const {  isLoaded, isSignedIn } = useUser();
  const router = useRouter();


    


  // Redirect after Firebase is signed in
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen flex items-center bg-white justify-center">
      <SignIn />
    </div>
  );
}

export default SignInPage;
