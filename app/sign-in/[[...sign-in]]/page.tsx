'use client'

import React, { useEffect, useState } from 'react';
import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { auth as firebaseAuth } from '../../../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

function SignInPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    async function signInToFirebase() {
      try {
        const res = await fetch('/api/firebase');
        const { token } = await res.json();

        if (token) {
          await signInWithCustomToken(firebaseAuth, token);
          console.log('✅ Signed into Firebase');
          setFirebaseReady(true);
        } else {
          console.error('❌ No Firebase token received');
        }
      } catch (err) {
        console.error('🔥 Firebase sign-in failed:', err);
      }
    }

    if (isSignedIn && isLoaded && !firebaseAuth.currentUser) {
      signInToFirebase();
    }
  }, [isSignedIn, isLoaded]);

  // Redirect after Firebase is signed in
  useEffect(() => {
    if (firebaseReady) {
      router.replace('/dashboard');
    }
  }, [firebaseReady]);

  return (
    <div className="min-h-screen flex items-center bg-white justify-center">
      <SignIn />
    </div>
  );
}

export default SignInPage;
